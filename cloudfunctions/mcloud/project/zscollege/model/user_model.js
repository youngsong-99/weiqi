/**
 * Notes: 用户实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY wenxiao song Weiqi (wechat)
 * Date: 2020-10-14 19:20:00 
 */


const BaseProjectModel = require('./base_project_model.js');
class UserModel extends BaseProjectModel { }

// 集合名
UserModel.CL = BaseProjectModel.C('user');

UserModel.DB_STRUCTURE = {
	_pid: 'string|true',
	USER_ID: 'string|true',

	USER_MINI_OPENID: 'string|true|comment=小程序openid',
	USER_STATUS: 'int|true|default=1|comment=状态 0=待审核,1=正常,8=审核未过,9=禁用',
	USER_CHECK_REASON: 'string|false|comment=审核未过的理由',

	USER_NAME: 'string|false|comment=用户昵称',
	USER_MOBILE: 'string|false|comment=联系电话',

	USER_FORMS: 'array|true|default=[]',
	USER_OBJ: 'object|true|default={}',

	USER_LOGIN_CNT: 'int|true|default=0|comment=登陆次数',
	USER_LOGIN_TIME: 'int|false|comment=最近登录时间',


	USER_ADD_TIME: 'int|true',
	USER_ADD_IP: 'string|false',

	USER_EDIT_TIME: 'int|true',
  USER_EDIT_IP: 'string|false',
  
  USER_WECHAT: 'string|false|comment=用户微信',
  USER_EMAIL: 'string|false|comment=用户邮箱',
  USER_REASON: 'string|false|comment=入会原因',
  USER_WISHLIST: 'array|true|default=[]|comment=意愿部门',
  USER_ACCEPTASSIGN: 'bool|false',
  USER_MINI_PASSWORD: 'string|false|comment=密码',
  USER_RESOURCELIST: 'array|true|default=[]|comment=可提供资源',

  USER_PRIVACY: 'bool|false',
  USER_WECHAT_NICKNAME: 'string|false|comment=用户微信昵称',

  USER_ROLE: 'int|true|default=0|comment=用户角色 0=普通用户,1=会员,2=管理团队',
  USER_APPLICATION_STATUS: 'int|false|default=0|comment=申请状态 0=未提交,1=会员审核中,2=管理团队审核中,3=会员已批准,4=已拒绝',
}

// 字段前缀
UserModel.FIELD_PREFIX = "USER_";

/**
 * 状态 0=待审核,1=正常,2=审核未过,9=禁用
 */
UserModel.STATUS = {
	UNUSE: 0,
	COMM: 1,
	UNCHECK: 8,
	FORBID: 9
};

UserModel.STATUS_DESC = {
	UNUSE: '待审核',
	COMM: '正常',
	UNCHECK: '未通过审核',
	FORBID: '禁用'
};

UserModel.ROLE = {
	VISITOR: 0,
	USER: 1,
	MEMBER: 2,
};

UserModel.APPLICATION_STATUS = {
	UNUSE: 0,
  IN_PROGRESS_USER: 1,
  IN_PROGRESS_MEMBER: 2,
  APPROVED: 3,
  REVOKED: 4,
};


module.exports = UserModel;