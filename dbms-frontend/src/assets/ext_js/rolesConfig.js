
//#region 
/*
* Kindly note taht the index of the elements is being used in the componenats templates to assign the permissions.
ex:
*in your component.ts file we must import environment , then assign it to variable lets say environment too. : 
    import { environment } from "src/environments/environment";
    environment = environment;
*in the html template we can use the environment variable to access the roles array, then get any element by index as follow :
    <button *ngxPermissionsOnly=" environment.roles[17] ; authorisedStrategy: 'show'; unauthorisedStrategy: 'remove'">Run</button>
* In the above examble we refer to the element at index 17 to assign the permission "ROLE_EXECUTE_JOB" to the ngxPermissionsOnly directive, in order to secure the Run button.
*Important: Whenever any change happens in the permission  column in the DB , this change must be reflected here in the roles array as well.Otherwise the permessions will not be working.       
*Important: Keep the array in the same order, add new elements to the end .     
*/
//#endregion

window['roles'] = [
    "ROLE_LIST_AGENT",//0
    "ROLE_REGISTER_AGENT", //1
    "ROLE_UPDATE_TASK_STATUS",//2
    "ROLE_UPDATE_AGENT_STATUS",	//3
    "ROLE_CREATE_JOB", //4
    "ROLE_LIST_JOB",//5
    "ROLE_LIST_JOB_BY_ID",//6
    "ROLE_DELETE_JOB",//7
    "ROLE_EXECUTE_JOB", //8
    "ROLE_EXECUTE_TASK", //9
    "ROLE_VIEW_REPORT",	//10
    "ROLE_CREATE_USER",	//11
    "ROLE_ASSIGN_ROLE",	//12
    "ROLE_ASSIGN_PERMISSIONS",//13
    "ROLE_CREATE_ROLE",//14
    "ROLE_CHANGE_PASSWORD",//15
    "ROLE_DELETE_USER",	//16
    "ROLE_EDIT_JOB",//17
    "ROLE_LIST_PERMISSIONS", //18
    "ROLE_EDIT_ROLE",//19
    "ROLE_DELETE_ROLE",//20
    "ROLE_LIST_ROLE",	//21
    "ROLE_LIST_ROLE_BY_ID",	//22
    "ROLE_LIST_USERS",//23
    "ROLE_LIST_USER_BY_ID",	//24
    "ROLE_LIST_FILE_EXTENSIONS",//25
    "ROLE_PULL_DATA_ELEMENT", //26
    "VIEW_BT_CONFIG", //27
    "VIEW_CONFIGURATIONS",//28
    "VIEW_DATA_ELEMENT_SELECTION",//29
    "VIEW_DATA_ELEMENT_CREATION",//30
    "VIEW_DATA_SOURCE_CONNECTION",//31
    "VIEW_DATA_CONNECTION_USAGE",//32
    "VIEW_MANAGE_ROLES",//33
    "ROLE_LIST_BUSINESS_TRANSACTIONS",	//34
    "ROLE_VIEW_TRANSACTION_DETAILS_CHARTS",	//35
    "ROLE_VIEW_CLASS_DETAILS",//36
    "ROLE_LIST_ATTACKS", //37
    "ROLE_PERFORM_ATTACKS",//38
    "ROLE_APIPY_HOSTSLIST", //39
    "ROLE_APIPY_ADDHOST", //40
    "ROLE_APIPY_DELHOST", //41
    "ROLE_APIPY_HSTATUS",//42
    "ROLE_VIEW_INJECTION_REPORTS",//43
    "ROLE_ASSIGN_ROLE_TO_USER",	//44
    "ROLE_ASSIGN_PERMISSIONS_TO_ROLE", //45
    "ROLE_READ_ROLES", //46
    "ROLE_READ_SINGLE_ROLE", //47
    "ROLE_READ_SINGLE_USER",//48
    "ROLE_BROADCAST_DATA_ELEMENT",//49
    "ROLE_LIST_DATA_ELEMENT", //50
    "ROLE_CREATE_DATAELEMENT_CONFIG",//51
    "ROLE_DELETE_DATAELEMENT_CONFIG",//52 
    "ROLE_CREATE_DATASOURCE",//53
    "ROLE_DELETE_DATASOURCE",//54
    "ROLE_UPDATE_CONNECTION_SETTINGS",//55
    "ROLE_ADD_DATA_ELEMENT",//56
    "ROLE_DELETE_DATA_ELEMENT",//57
    "ROLE_EDIT_DATA_ELEMENT",//58
    "ROLE_VALIDATE_REGEX",//59
    "ROLE_APIPY_LISTBUSINESSTRANSACTIONPERFORMANCEBYTIER", //60
    "ROLE_APIPY_REPORTS_TRANSACTIONLOG", //61
    "ROLE_APIPY_REPORTS_TRANSACTIONTILES",//62
    "ROLE_APIPY_REPORTS_TRANSACTIONCLASS",//63
    "ROLE_APIPY_HOSTS",//64
    "ROLE_APIPY_ATTACKS_CPU",//65
    "ROLE_APIPY_ATTACKS_ABORT",//66
    "ROLE_APIPY_ATTACKS_RAM",//67
    "ROLE_APIPY_ATTACKS_IO",//68
    "ROLE_APIPY_ATTACKS_NULLROUTE",//69
    "ROLE_APIPY_ATTACKS_NETWORKLATENCY",//70
    "ROLE_APIPY_ATTACKS_NETWORKCORRUPTION",//71
    "ROLE_APIPY_ATTACKS_NETWORKLOSS",//72
    "ROLE_APIPY_ATTACKS_SHUTDOWN",//73
    "ROLE_LIST_ATTACKS",//74
    "ROLE_PERFORM_ATTACKS",//75
    "ROLE_APIPY_REPORTS_BARGRAPH",//76
    "ROLE_APIPY_REPORTS_PIGRAPH",//77
    "ROLE_APIPY_REPORTS_LINEGRAPH",//78
    "ROLE_VIEW_REPORT",//79
    "ROLE_APIPY_REPORTS_GETBUSSINESSTXNEXECUTION",//80
    "ROLE_APIPY_REPORTS_SDLC",//81
    "ROLE_APIPY_REPORTS_SDLCTILES",//82
    "ROLE_APIPY_GETOSLIST",//83
    "ROLE_APIPY_UPDATEHOST",//84
    "ROLE_UPDATE_USER", //85
]

