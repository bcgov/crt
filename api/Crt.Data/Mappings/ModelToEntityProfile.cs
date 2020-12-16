﻿using AutoMapper;
using Crt.Data.Database.Entities;
using Crt.Model.Dtos.CodeLookup;
using Crt.Model.Dtos.Permission;
using Crt.Model.Dtos.Role;
using Crt.Model.Dtos.RolePermission;
using Crt.Model.Dtos.User;
using Crt.Model.Dtos.UserRole;

namespace Crt.Data.Mappings
{
    public class ModelToEntityProfile : Profile
    {
        public ModelToEntityProfile()
        {
            SourceMemberNamingConvention = new LowerUnderscoreNamingConvention();
            DestinationMemberNamingConvention = new PascalCaseNamingConvention();

            CreateMap<PermissionDto, CrtPermission>();

            CreateMap<RoleDto, CrtRole>();
            CreateMap<RoleCreateDto, CrtRole>();
            CreateMap<RoleUpdateDto, CrtRole>();
            CreateMap<RoleSearchDto, CrtRole>();
            CreateMap<RoleDeleteDto, CrtRole>();

            CreateMap<RolePermissionDto, CrtRolePermission>();

            CreateMap<UserDto, CrtSystemUser>();
            CreateMap<UserCreateDto, CrtSystemUser>();
            CreateMap<UserCurrentDto, CrtSystemUser>();
            CreateMap<UserSearchDto, CrtSystemUser>();
            CreateMap<UserUpdateDto, CrtSystemUser>();
            CreateMap<UserDeleteDto, CrtSystemUser>();

            CreateMap<UserRoleDto, CrtUserRole>();

            CreateMap<CodeLookupDto, CrtCodeLookup>();
        }
    }
}