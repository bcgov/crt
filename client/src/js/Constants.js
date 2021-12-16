export const RUNTIME_OPENSHIFT_BUILD_COMMIT = window.RUNTIME_OPENSHIFT_BUILD_COMMIT ?? '';

export const API_URL = window.RUNTIME_REACT_APP_API_HOST
  ? `${window.location.protocol}//${window.RUNTIME_REACT_APP_API_HOST}/api`
  : process.env.REACT_APP_API_HOST;

export const DWPBI_URL = window.RUNTIME_REACT_APP_DWPBI_URL ?? process.env.REACT_APP_DWPBI_URL;

const CODE_LOOKUP = '/codelookup';

export const API_PATHS = {
  CODE_LOOKUP: CODE_LOOKUP,
  CAPITAL_INDEXES: `${CODE_LOOKUP}/capitalindexes`,
  RC_NUMBERS: `${CODE_LOOKUP}/rcnumbers`,
  NEAREST_TOWNS: `${CODE_LOOKUP}/nearesttowns`,
  PHASES: `${CODE_LOOKUP}/phases`,
  FISCAL_YEARS: `${CODE_LOOKUP}/fiscalyears`,
  QUANTITIES: `${CODE_LOOKUP}/quantities`,
  ACCOMPLISHMENTS: `${CODE_LOOKUP}/accomplishments`,
  CONTRACTORS: `${CODE_LOOKUP}/contractors`,
  FUNDING_TYPES: `${CODE_LOOKUP}/fundingtypes`,
  RATIO_RECORDS_TYPES: `${CODE_LOOKUP}/ratiorecordtypes`,
  ELECTORAL_DISTRICTS: `${CODE_LOOKUP}/electoraldistricts`,
  HIGHWAYS: `${CODE_LOOKUP}/highways`,
  ECONOMIC_REGIONS: `${CODE_LOOKUP}/economicregions`,
  CODESETS: `${CODE_LOOKUP}/codesets`,
  PROJECT_MANAGERS: `${CODE_LOOKUP}/managers`,
  PROGRAMS: `${CODE_LOOKUP}/programs`,
  PROGRAM_CATEGORIES: `${CODE_LOOKUP}/programcategories`,
  SERVICE_LINES: `${CODE_LOOKUP}/servicelines`,
  PERMISSIONS: '/permissions',
  ROLE: '/roles',
  USER: '/users',
  USER_CURRENT: '/users/current',
  USER_STATUSES: '/users/userstatus',
  USER_AD_ACCOUNT: '/users/adaccount',
  REGIONS: '/regions',
  SUPPORTED_FORMATS: '/exports/supportedformats',
  VERSION: '/version',
  PROJECTS: '/projects',
  NOTES: '/notes',
  PROJECT_PLAN: '/projectplan',
  ELEMENTS: `/elements`,
  ELEMENTS_SEARCH: '/elements/search',
  FIN_TARGETS: '/targets',
  QTY_ACCMPS: '/qtyaccmps',
  PROJECT_TENDER: '/projecttender',
  TENDER: '/tenders',
  PROJECT_SEGMENT: '/segments',
  PROJECT_LOCATION: '/projectlocation',
  DISTRICTS: '/districts',
  SERVICE_AREAS: '/serviceareas',
  RATIO: '/ratio',
  RATIOS: '/ratios',
  CODE_TABLE: '/codetable',
  CLONE: '/clone',
};

export const PATHS = {
  UNAUTHORIZED: '/unauthorized',
  HOME: '/',
  ABOUT: '/admin/about',
  API_ACCESS: '/admin/api-access',
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_ROLES: '/admin/roles',
  ADMIN_CODE_TABLES: '/admin/codetables',
  ADMIN_ELEMENTS: '/admin/elements',
  VERSION: '/version',
  PROJECTS: '/projects',
  PROJECT_PLAN: '/projectplan',
  PROJECT_TENDER: '/projecttender',
  PROJECT_SEGMENT: '/segments',
  TWM: '/twm/',
};

export const MESSAGE_DATE_FORMAT = 'YYYY-MM-DD hh:mmA';

export const DATE_DISPLAY_FORMAT = 'YYYY-MM-DD';

export const DATE_UTC_FORMAT = 'YYYY-MM-DDTHH:mm';

export const FISCAL_YEAR_END = '03-31';

export const FORM_TYPE = { ADD: 'ADD_FORM', EDIT: 'EDIT_FORM', CLONE: 'CLONE_FORM' };

export const PERMISSIONS = {
  CODE_W: 'CODE_W',
  CODE_R: 'CODE_R',
  EXPORT_R: 'EXPORT_R',
  PROJECT_R: 'PROJECT_R',
  PROJECT_W: 'PROJECT_W',
  ROLE_W: 'ROLE_W',
  ROLE_R: 'ROLE_R',
  USER_W: 'USER_W',
  USER_R: 'USER_R',
  API_W: 'API_W',
};

export const USER_TYPE = { INTERNAL: 'INTERNAL', BUSINESS: 'BUSINESS' };

export const ACTIVE_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

export const ACTIVE_STATUS_ARRAY = Object.keys(ACTIVE_STATUS).map((key) => ({
  id: ACTIVE_STATUS[key],
  name: ACTIVE_STATUS[key],
}));

export const SORT_DIRECTION = {
  ASCENDING: 'asc',
  DESCENDING: 'desc',
};

export const DEFAULT_PAGE_SIZE_OPTIONS = process.env.REACT_APP_DEFAULT_PAGE_SIZE_OPTIONS.split(',').map((o) =>
  parseInt(o)
);

export const DEFAULT_PAGE_SIZE = parseInt(process.env.REACT_APP_DEFAULT_PAGE_SIZE);
