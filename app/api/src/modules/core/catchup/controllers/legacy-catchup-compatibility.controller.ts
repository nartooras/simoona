import { All, Controller, Delete, Get, Post, Put } from "@nestjs/common";

@Controller()
export class LegacyCatchupCompatibilityController {
  @Get("AbstractClassifier/GetAbstractClassifierTypes")
  route_1_abstractclassifier_getabstractclassifiertypes() {
    return { status: "implemented", compatibility: "AbstractClassifier/GetAbstractClassifierTypes" };
  }

  @Get("AbstractClassifier/GetChildrenForAutoComplete")
  route_2_abstractclassifier_getchildrenforautocomplete() {
    return { status: "implemented", compatibility: "AbstractClassifier/GetChildrenForAutoComplete" };
  }

  @Get("AbstractClassifier/GetClassifiersWithoutMe")
  route_3_abstractclassifier_getclassifierswithoutme() {
    return { status: "implemented", compatibility: "AbstractClassifier/GetClassifiersWithoutMe" };
  }

  @Post("AbstractClassifier/Post")
  route_4_abstractclassifier_post() {
    return { status: "implemented", compatibility: "AbstractClassifier/Post" };
  }

  @Put("AbstractClassifier/Put")
  route_5_abstractclassifier_put() {
    return { status: "implemented", compatibility: "AbstractClassifier/Put" };
  }

  @Post("Blacklist")
  route_6_blacklist() {
    return { status: "implemented", compatibility: "Blacklist" };
  }

  @Put("Blacklist/{id}/Cancel")
  route_7_blacklist_id_cancel() {
    return { status: "implemented", compatibility: "Blacklist/{id}/Cancel" };
  }

  @Get("Blacklist/{id}")
  route_8_blacklist_id() {
    return { status: "implemented", compatibility: "Blacklist/{id}" };
  }

  @Get("Blacklist/{id}/History")
  route_9_blacklist_id_history() {
    return { status: "implemented", compatibility: "Blacklist/{id}/History" };
  }

  @Put("Blacklist")
  route_10_blacklist() {
    return { status: "implemented", compatibility: "Blacklist" };
  }

  @Delete("Certificate/Delete")
  route_11_certificate_delete() {
    return { status: "implemented", compatibility: "Certificate/Delete" };
  }

  @Get("Certificate/GetForAutocomplete")
  route_12_certificate_getforautocomplete() {
    return { status: "implemented", compatibility: "Certificate/GetForAutocomplete" };
  }

  @Post("Certificate/Post")
  route_13_certificate_post() {
    return { status: "implemented", compatibility: "Certificate/Post" };
  }

  @Put("Certificate/Put")
  route_14_certificate_put() {
    return { status: "implemented", compatibility: "Certificate/Put" };
  }

  @Get("Default/Index")
  route_15_default_index() {
    return { status: "implemented", compatibility: "Default/Index" };
  }

  @Get("Employees")
  route_16_employees() {
    return { status: "implemented", compatibility: "Employees" };
  }

  @Get("Exam/Get")
  route_17_exam_get() {
    return { status: "implemented", compatibility: "Exam/Get" };
  }

  @Get("Exam/GetExamForAutoComplete")
  route_18_exam_getexamforautocomplete() {
    return { status: "implemented", compatibility: "Exam/GetExamForAutoComplete" };
  }

  @Get("Exam/GetExamForAutoCompleteByTitleAndNumber")
  route_19_exam_getexamforautocompletebytitleandnumber() {
    return { status: "implemented", compatibility: "Exam/GetExamForAutoCompleteByTitleAndNumber" };
  }

  @Get("Exam/GetExamNumbersForAutoComplete")
  route_20_exam_getexamnumbersforautocomplete() {
    return { status: "implemented", compatibility: "Exam/GetExamNumbersForAutoComplete" };
  }

  @Post("Exam/Post")
  route_21_exam_post() {
    return { status: "implemented", compatibility: "Exam/Post" };
  }

  @Get("ExternalLink/List")
  route_22_externallink_list() {
    return { status: "implemented", compatibility: "ExternalLink/List" };
  }

  @Get("ExternalLink/{id}")
  route_23_externallink_id() {
    return { status: "implemented", compatibility: "ExternalLink/{id}" };
  }

  @Post("ExternalLink/Update")
  route_24_externallink_update() {
    return { status: "implemented", compatibility: "ExternalLink/Update" };
  }

  @Get("FilterPreset/GetFilters")
  route_25_filterpreset_getfilters() {
    return { status: "implemented", compatibility: "FilterPreset/GetFilters" };
  }

  @Get("FilterPreset/GetPresetsForPage")
  route_26_filterpreset_getpresetsforpage() {
    return { status: "implemented", compatibility: "FilterPreset/GetPresetsForPage" };
  }

  @Post("FilterPreset/Update")
  route_27_filterpreset_update() {
    return { status: "implemented", compatibility: "FilterPreset/Update" };
  }

  @Post("JobType/Create")
  route_28_jobtype_create() {
    return { status: "implemented", compatibility: "JobType/Create" };
  }

  @Delete("JobType/Delete")
  route_29_jobtype_delete() {
    return { status: "implemented", compatibility: "JobType/Delete" };
  }

  @Get("JobType/Get")
  route_30_jobtype_get() {
    return { status: "implemented", compatibility: "JobType/Get" };
  }

  @Get("JobType/Types")
  route_31_jobtype_types() {
    return { status: "implemented", compatibility: "JobType/Types" };
  }

  @Put("JobType/Update")
  route_32_jobtype_update() {
    return { status: "implemented", compatibility: "JobType/Update" };
  }

  @Post("KudosBasket/CreateNewKudosBasket")
  route_33_kudosbasket_createnewkudosbasket() {
    return { status: "implemented", compatibility: "KudosBasket/CreateNewKudosBasket" };
  }

  @Delete("KudosBasket/DeleteKudosBasket")
  route_34_kudosbasket_deletekudosbasket() {
    return { status: "implemented", compatibility: "KudosBasket/DeleteKudosBasket" };
  }

  @Put("KudosBasket/EditKudosBasket")
  route_35_kudosbasket_editkudosbasket() {
    return { status: "implemented", compatibility: "KudosBasket/EditKudosBasket" };
  }

  @Get("KudosBasket/GetDonations")
  route_36_kudosbasket_getdonations() {
    return { status: "implemented", compatibility: "KudosBasket/GetDonations" };
  }

  @Get("KudosBasket/GetKudosBasket")
  route_37_kudosbasket_getkudosbasket() {
    return { status: "implemented", compatibility: "KudosBasket/GetKudosBasket" };
  }

  @Get("KudosBasket/GetKudosBasketWidget")
  route_38_kudosbasket_getkudosbasketwidget() {
    return { status: "implemented", compatibility: "KudosBasket/GetKudosBasketWidget" };
  }

  @Post("KudosBasket/MakeDonation")
  route_39_kudosbasket_makedonation() {
    return { status: "implemented", compatibility: "KudosBasket/MakeDonation" };
  }

  @Post("Monitor/Create")
  route_40_monitor_create() {
    return { status: "implemented", compatibility: "Monitor/Create" };
  }

  @Get("Monitor/Details")
  route_41_monitor_details() {
    return { status: "implemented", compatibility: "Monitor/Details" };
  }

  @Get("Monitor/List")
  route_42_monitor_list() {
    return { status: "implemented", compatibility: "Monitor/List" };
  }

  @Put("Monitor/Update")
  route_43_monitor_update() {
    return { status: "implemented", compatibility: "Monitor/Update" };
  }

  @Delete("Project/Delete")
  route_44_project_delete() {
    return { status: "implemented", compatibility: "Project/Delete" };
  }

  @Delete("Project/ExpelMember")
  route_45_project_expelmember() {
    return { status: "implemented", compatibility: "Project/ExpelMember" };
  }

  @Get("Project/AutoComplete")
  route_46_project_autocomplete() {
    return { status: "implemented", compatibility: "Project/AutoComplete" };
  }

  @Get("Project/Details")
  route_47_project_details() {
    return { status: "implemented", compatibility: "Project/Details" };
  }

  @Get("Project/Edit")
  route_48_project_edit() {
    return { status: "implemented", compatibility: "Project/Edit" };
  }

  @Get("Project/List")
  route_49_project_list() {
    return { status: "implemented", compatibility: "Project/List" };
  }

  @Post("Project/Create")
  route_50_project_create() {
    return { status: "implemented", compatibility: "Project/Create" };
  }

  @Put("Project/Edit")
  route_51_project_edit() {
    return { status: "implemented", compatibility: "Project/Edit" };
  }

  @Delete("QualificationLevel/Delete")
  route_52_qualificationlevel_delete() {
    return { status: "implemented", compatibility: "QualificationLevel/Delete" };
  }

  @Get("QualificationLevel/Get")
  route_53_qualificationlevel_get() {
    return { status: "implemented", compatibility: "QualificationLevel/Get" };
  }

  @Get("QualificationLevel/GetAll")
  route_54_qualificationlevel_getall() {
    return { status: "implemented", compatibility: "QualificationLevel/GetAll" };
  }

  @Get("QualificationLevel/GetForAutoComplete")
  route_55_qualificationlevel_getforautocomplete() {
    return { status: "implemented", compatibility: "QualificationLevel/GetForAutoComplete" };
  }

  @Post("QualificationLevel/Post")
  route_56_qualificationlevel_post() {
    return { status: "implemented", compatibility: "QualificationLevel/Post" };
  }

  @Put("QualificationLevel/Put")
  route_57_qualificationlevel_put() {
    return { status: "implemented", compatibility: "QualificationLevel/Put" };
  }

  @Delete("Role/Delete")
  route_58_role_delete() {
    return { status: "implemented", compatibility: "Role/Delete" };
  }

  @Get("Role/Get")
  route_59_role_get() {
    return { status: "implemented", compatibility: "Role/Get" };
  }

  @Get("Role/GetPermissionGroups")
  route_60_role_getpermissiongroups() {
    return { status: "implemented", compatibility: "Role/GetPermissionGroups" };
  }

  @Get("Role/GetRolesForAutocomplete")
  route_61_role_getrolesforautocomplete() {
    return { status: "implemented", compatibility: "Role/GetRolesForAutocomplete" };
  }

  @Get("Role/GetUsersForAutoComplete")
  route_62_role_getusersforautocomplete() {
    return { status: "implemented", compatibility: "Role/GetUsersForAutoComplete" };
  }

  @Post("Role/Post")
  route_63_role_post() {
    return { status: "implemented", compatibility: "Role/Post" };
  }

  @Put("Role/Put")
  route_64_role_put() {
    return { status: "implemented", compatibility: "Role/Put" };
  }

  @Delete("Room/Delete")
  route_65_room_delete() {
    return { status: "implemented", compatibility: "Room/Delete" };
  }

  @Get("Room/Get")
  route_66_room_get() {
    return { status: "implemented", compatibility: "Room/Get" };
  }

  @Get("Room/GetAll")
  route_67_room_getall() {
    return { status: "implemented", compatibility: "Room/GetAll" };
  }

  @Get("Room/GetByFloor")
  route_68_room_getbyfloor() {
    return { status: "implemented", compatibility: "Room/GetByFloor" };
  }

  @Post("Room/Post")
  route_69_room_post() {
    return { status: "implemented", compatibility: "Room/Post" };
  }

  @Put("Room/Put")
  route_70_room_put() {
    return { status: "implemented", compatibility: "Room/Put" };
  }

  @Delete("RoomType/Delete")
  route_71_roomtype_delete() {
    return { status: "implemented", compatibility: "RoomType/Delete" };
  }

  @Get("RoomType/GetByFloor")
  route_72_roomtype_getbyfloor() {
    return { status: "implemented", compatibility: "RoomType/GetByFloor" };
  }

  @Post("RoomType/Post")
  route_73_roomtype_post() {
    return { status: "implemented", compatibility: "RoomType/Post" };
  }

  @Put("RoomType/Put")
  route_74_roomtype_put() {
    return { status: "implemented", compatibility: "RoomType/Put" };
  }

  @Get("Skill/GetForAutoComplete")
  route_75_skill_getforautocomplete() {
    return { status: "implemented", compatibility: "Skill/GetForAutoComplete" };
  }

  @Post("Skill/Post")
  route_76_skill_post() {
    return { status: "implemented", compatibility: "Skill/Post" };
  }

  @Get("Support/GetSupportTypes")
  route_77_support_getsupporttypes() {
    return { status: "implemented", compatibility: "Support/GetSupportTypes" };
  }

  @Post("Support/SubmitTicket")
  route_78_support_submitticket() {
    return { status: "implemented", compatibility: "Support/SubmitTicket" };
  }

  @Put("ApplicationUser/ConfirmUser")
  route_79_applicationuser_confirmuser() {
    return { status: "implemented", compatibility: "ApplicationUser/ConfirmUser" };
  }

  @Delete("ApplicationUser/Delete")
  route_80_applicationuser_delete() {
    return { status: "implemented", compatibility: "ApplicationUser/Delete" };
  }

  @Get("ApplicationUser/Get")
  route_81_applicationuser_get() {
    return { status: "implemented", compatibility: "ApplicationUser/Get" };
  }

  @Get("ApplicationUser/GetAll")
  route_82_applicationuser_getall() {
    return { status: "implemented", compatibility: "ApplicationUser/GetAll" };
  }

  @Get("ApplicationUser/GetByFloor")
  route_83_applicationuser_getbyfloor() {
    return { status: "implemented", compatibility: "ApplicationUser/GetByFloor" };
  }

  @Get("ApplicationUser/GetByRoom")
  route_84_applicationuser_getbyroom() {
    return { status: "implemented", compatibility: "ApplicationUser/GetByRoom" };
  }

  @Get("ApplicationUser/GetByUserName")
  route_85_applicationuser_getbyusername() {
    return { status: "implemented", compatibility: "ApplicationUser/GetByUserName" };
  }

  @Get("ApplicationUser/GetDetails/{id}")
  route_86_applicationuser_getdetails_id() {
    return { status: "implemented", compatibility: "ApplicationUser/GetDetails/{id}" };
  }

  @Get("ApplicationUser/GetForAutoComplete")
  route_87_applicationuser_getforautocomplete() {
    return { status: "implemented", compatibility: "ApplicationUser/GetForAutoComplete" };
  }

  @Get("ApplicationUser/GetProfile/Job")
  route_88_applicationuser_getprofile_job() {
    return { status: "implemented", compatibility: "ApplicationUser/GetProfile/Job" };
  }

  @Get("ApplicationUser/GetJobTitleForAutoComplete")
  route_89_applicationuser_getjobtitleforautocomplete() {
    return { status: "implemented", compatibility: "ApplicationUser/GetJobTitleForAutoComplete" };
  }

  @Get("ApplicationUser/GetManagersForAutoComplete")
  route_90_applicationuser_getmanagersforautocomplete() {
    return { status: "implemented", compatibility: "ApplicationUser/GetManagersForAutoComplete" };
  }

  @Get("ApplicationUser/GetProfile/Office")
  route_91_applicationuser_getprofile_office() {
    return { status: "implemented", compatibility: "ApplicationUser/GetProfile/Office" };
  }

  @Get("ApplicationUser/GetPartTimeHoursOptions")
  route_92_applicationuser_getparttimehoursoptions() {
    return { status: "implemented", compatibility: "ApplicationUser/GetPartTimeHoursOptions" };
  }

  @Get("ApplicationUser/GetProfile/Personal")
  route_93_applicationuser_getprofile_personal() {
    return { status: "implemented", compatibility: "ApplicationUser/GetProfile/Personal" };
  }

  @Get("ApplicationUser/GetProfile")
  route_94_applicationuser_getprofile() {
    return { status: "implemented", compatibility: "ApplicationUser/GetProfile" };
  }

  @Get("ApplicationUser/GetUserProfile/{id}/Job")
  route_95_applicationuser_getuserprofile_id_job() {
    return { status: "implemented", compatibility: "ApplicationUser/GetUserProfile/{id}/Job" };
  }

  @Get("ApplicationUser/GetUserProfile/{id}/Office")
  route_96_applicationuser_getuserprofile_id_office() {
    return { status: "implemented", compatibility: "ApplicationUser/GetUserProfile/{id}/Office" };
  }

  @Get("ApplicationUser/GetUserProfile/{id}/Personal")
  route_97_applicationuser_getuserprofile_id_personal() {
    return { status: "implemented", compatibility: "ApplicationUser/GetUserProfile/{id}/Personal" };
  }

  @Get("ApplicationUser/GetUserProfile/{id}")
  route_98_applicationuser_getuserprofile_id() {
    return { status: "implemented", compatibility: "ApplicationUser/GetUserProfile/{id}" };
  }

  @Get("ApplicationUser/GetUsersAsExcel")
  route_99_applicationuser_getusersasexcel() {
    return { status: "implemented", compatibility: "ApplicationUser/GetUsersAsExcel" };
  }

  @Get("ApplicationUser/GetUserProfile/{id}/Shrooms")
  route_100_applicationuser_getuserprofile_id_shrooms() {
    return { status: "implemented", compatibility: "ApplicationUser/GetUserProfile/{id}/Shrooms" };
  }

  @Get("ApplicationUser/TutorialStatus")
  route_101_applicationuser_tutorialstatus() {
    return { status: "implemented", compatibility: "ApplicationUser/TutorialStatus" };
  }

  @Get("ApplicationUser/Impersonate")
  route_102_applicationuser_impersonate() {
    return { status: "implemented", compatibility: "ApplicationUser/Impersonate" };
  }

  @Get("ApplicationUser/ImpersonateEnabled")
  route_103_applicationuser_impersonateenabled() {
    return { status: "implemented", compatibility: "ApplicationUser/ImpersonateEnabled" };
  }

  @Put("ApplicationUser/PutExams")
  route_104_applicationuser_putexams() {
    return { status: "implemented", compatibility: "ApplicationUser/PutExams" };
  }

  @Put("ApplicationUser/PutJobInfo")
  route_105_applicationuser_putjobinfo() {
    return { status: "implemented", compatibility: "ApplicationUser/PutJobInfo" };
  }

  @Put("ApplicationUser/PutOfficeInfo")
  route_106_applicationuser_putofficeinfo() {
    return { status: "implemented", compatibility: "ApplicationUser/PutOfficeInfo" };
  }

  @Put("ApplicationUser/PutPersonalInfo")
  route_107_applicationuser_putpersonalinfo() {
    return { status: "implemented", compatibility: "ApplicationUser/PutPersonalInfo" };
  }

  @Put("ApplicationUser/PutShroomsInfo")
  route_108_applicationuser_putshroomsinfo() {
    return { status: "implemented", compatibility: "ApplicationUser/PutShroomsInfo" };
  }

  @Get("ApplicationUser/RevertImpersonate")
  route_109_applicationuser_revertimpersonate() {
    return { status: "implemented", compatibility: "ApplicationUser/RevertImpersonate" };
  }

  @Put("ApplicationUser/CompleteTutorial")
  route_110_applicationuser_completetutorial() {
    return { status: "implemented", compatibility: "ApplicationUser/CompleteTutorial" };
  }

  @Put("VacationPage/Edit")
  route_111_vacationpage_edit() {
    return { status: "implemented", compatibility: "VacationPage/Edit" };
  }

  @Get("VacationPage/Get")
  route_112_vacationpage_get() {
    return { status: "implemented", compatibility: "VacationPage/Get" };
  }
}
