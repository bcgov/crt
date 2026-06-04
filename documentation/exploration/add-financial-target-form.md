# Add Financial Target Form

## URL
`https://dev-crt.th.gov.bc.ca/projects/{id}/projectplan` (click "+ Add" button)

## Purpose
Adds a financial target/plan entry for a project, specifying the fiscal year, phase, element, funding type, and dollar amount.

## Key Elements

| Element | Type | Selector | Notes |
|---------|------|----------|-------|
| Fiscal Year | Dropdown | `[role="dialog"] .dropdown:nth(0) button` | Required* - see options |
| Phase | Dropdown | `[role="dialog"] .dropdown:nth(1) button` | See options |
| Forecasted Amount | Currency Input | `input[name="forecastAmount"]` or currency field | $0 default |
| Element | Dropdown | `[role="dialog"] .dropdown:nth(2) button` | 50+ options |
| Funding Type | Dropdown | `[role="dialog"] .dropdown:nth(3) button` | See options |
| Description | Textarea | `textarea` in dialog | Optional |
| Submit | Button | `button:has-text("Submit")` | Disabled until required fields filled |
| Cancel | Button | `button:has-text("Cancel")` | Closes modal |

## Dropdown Options

### Fiscal Year
- 2010/2011 through 2027/2028
- "TBD"

### Phase
- "" (empty)
- "P-Plan"
- "E-Engineer"
- "C-Construct"
- "O-Other"
- "S-Shelf Ready"
- "F-Complete"
- "U-Unknown"

### Element (50+ options, sample)
- "Bb-Bike BC"
- "Br-Bridge"
- "Fb-Federal Biking/Walking"
- "Gp-General Paving"
- "He-Highway Expansion"
- "Im-Intersection Improvements"
- "Rs-Roadside"
- "Ss-Side Streets"
- "Ts-Transit-Operating"
- (many more)

### Funding Type
- "" (empty)
- "Allocation"
- "Priority"
- "Over Program"
- "Bridge Uplift"
- "Partner $"
- "Notional"
- "DFAA"
- "BCTFA"
