using Crt.Domain.Services;
using Crt.Model;
using Microsoft.Extensions.Configuration;
using Moq;
using System;
using Xunit;

namespace Crt.Tests.Ldap
{
    public class LdapServiceShould
    {
        private static LdapService BuildSut()
        {
            var config = new Mock<IConfiguration>();
            config.Setup(c => c.GetValue<string>("ServiceAccount:User")).Returns("user");
            config.Setup(c => c.GetValue<string>("ServiceAccount:Password")).Returns("pass");
            config.Setup(c => c.GetValue<string>("ServiceAccount:Server")).Returns("localhost");
            config.Setup(c => c.GetValue<int>("ServiceAccount:Port")).Returns(389);

            // ConfigurationExtensions read via indexer; set up the section calls too.
            var userSection   = BuildSection("user");
            var passSection   = BuildSection("pass");
            var serverSection = BuildSection("localhost");
            var portSection   = BuildSection("389");

            config.Setup(c => c.GetSection("ServiceAccount:User")).Returns(userSection);
            config.Setup(c => c.GetSection("ServiceAccount:Password")).Returns(passSection);
            config.Setup(c => c.GetSection("ServiceAccount:Server")).Returns(serverSection);
            config.Setup(c => c.GetSection("ServiceAccount:Port")).Returns(portSection);

            return new LdapService(config.Object);
        }

        private static IConfigurationSection BuildSection(string value)
        {
            var section = new Mock<IConfigurationSection>();
            section.Setup(s => s.Value).Returns(value);
            return section.Object;
        }

        // EscapeLdapFilterValue tests

        [Fact]
        public void EscapeBackslash()
        {
            Assert.Equal(@"abc\5cdef", LdapService.EscapeLdapFilterValue(@"abc\def"));
        }

        [Fact]
        public void EscapeAsterisk()
        {
            Assert.Equal(@"abc\2adef", LdapService.EscapeLdapFilterValue("abc*def"));
        }

        [Fact]
        public void EscapeOpenParenthesis()
        {
            Assert.Equal(@"abc\28def", LdapService.EscapeLdapFilterValue("abc(def"));
        }

        [Fact]
        public void EscapeCloseParenthesis()
        {
            Assert.Equal(@"abc\29def", LdapService.EscapeLdapFilterValue("abc)def"));
        }

        [Fact]
        public void EscapeNullByte()
        {
            Assert.Equal(@"abc\00def", LdapService.EscapeLdapFilterValue("abc\0def"));
        }

        [Fact]
        public void EscapeMultipleSpecialCharacters()
        {
            Assert.Equal(@"\28\29\2a\5c\00", LdapService.EscapeLdapFilterValue("()*\\\0"));
        }

        [Fact]
        public void LeaveNormalUsernameUnchanged()
        {
            Assert.Equal("jsmith", LdapService.EscapeLdapFilterValue("jsmith"));
        }

        [Fact]
        public void ThrowOnNullValue()
        {
            Assert.Throws<ArgumentNullException>(() => LdapService.EscapeLdapFilterValue(null));
        }

        // AllowList validation tests

        [Fact]
        public void ThrowArgumentExceptionForDisallowedFilterAttr()
        {
            var sut = BuildSut();

            var ex = Assert.Throws<ArgumentException>(() => sut.LdapSearch("injectedAttr", "value"));
            Assert.Equal("filterAttr", ex.ParamName);
        }

        [Theory]
        [InlineData(LdapAttrs.SamAccountName)]
        [InlineData(LdapAttrs.BcgovGuid)]
        public void AcceptAllowedFilterAttrs(string allowedAttr)
        {
            var sut = BuildSut();

            // The allowlist guard must pass; a network exception is expected
            // because no real LDAP server is present in the test environment.
            var ex = Record.Exception(() => sut.LdapSearch(allowedAttr, "testvalue"));
            Assert.IsNotType<ArgumentException>(ex);
        }
    }
}
