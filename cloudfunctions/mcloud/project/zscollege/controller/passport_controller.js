/**
 * Notes: passport模块控制器
 * Date: 2021-03-15 19:20:00 
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 */

const BaseProjectController = require('./base_project_controller.js');
const PassportService = require('../service/passport_service.js');
const contentCheck = require('../../../framework/validate/content_check.js');
const dataUtil = require('../../../framework/utils/data_util.js');
const UserModel = require('../model/user_model.js');

class PassportController extends BaseProjectController {

/** 微信登录 */
async loginWithWechat() {
  // 数据校验
  let rules = {};

  // 取得数据
  let input = this.validateData(rules);
  let wechatNickName = ''

  if (this._request.userInfo && this._request.userInfo.nickname!="") {
    wechatNickName = this._request.userInfo.nickName
  }
  let service = new PassportService();
  let res = await service.loginWithWechat(wechatNickName);

  if (res.token) {
    return res.token
  } else {
    const uniqueId = dataUtil.guid();
		return await service.registerWithWechatNickName(uniqueId, wechatNickName);
  }
} 

  /** 密码登录 */
  async loginWithPassWord() {
    // 数据校验
    let rules = {};

    // 取得数据
    let input = this.validateData(rules);
    let account = ''
    let password = ''

    if (this._request.loginAccount && this._request.loginPassword) {
    account = this._request.loginAccount
    password = this._request.loginPassword
    }
    let service = new PassportService();
    return await service.loginWithPassWord(account);
  } 

  

	/** 取得我的用户信息 */
	async getMyDetail() {
    let service = new PassportService();
		return await service.getMyDetail(this._token);
	}

	/** 获取手机号码 */
	async getPhone() {

		// 数据校验
		let rules = {
			cloudID: 'must|string|min:1|max:200|name=cloudID',
		};

		// 取得数据
		let input = this.validateData(rules);


		let service = new PassportService();
		return await service.getPhone(input.cloudID);
	}


	/** 注册 */
	async register() {
    // 数据校验
		let rules = {
			name: 'must|string|min:1|max:30|name=姓名',
			mobile: 'must|mobile|name=手机',
			forms: 'array|name=表单',
      status: 'int|default=1',
      weChat: 'must|string|min:1|max:30|name=微信',
      email:'must|string|min:1|max:30|name=邮箱',
      reason:'must|string|min:1|max:300|name=原因',
      resource:'must|string|min:1|max:300|name=资源',
      wishList: 'must|array|name=意愿',
      acceptAssign: 'must|boolean|name=意愿',
      password: 'must|string|min:8|max:30|name=密码'
		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiClient(input);
 
    let service = new PassportService();
    
    const uniqueId = dataUtil.guid();

		return await service.register(uniqueId, input);
	}
	
	/** 修改用户资料 */
	async editBase() {
    // 数据校验
    let rules = setEditRules(this)

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiClient(input);

		let service = new PassportService();
		return await service.editBase(this._token, input);
	}

	/** 登录 */
	async login() {
		// 数据校验
		let rules = {};

		// 取得数据
    let input = this.validateData(rules);
    let userID = ''

    if (this._token) {
      userID = this._token
    }
  
		let service = new PassportService();
		return await service.login(userID);
  }

}

function setEditRules(that) {
  let rules = {
    name: 'must|string|min:1|max:30|name=昵称',
    mobile: 'must|mobile|name=手机',
    forms: 'array|name=表单',
    status: 'int|default=1',
    weChat: 'must|string|min:1|max:30|name=微信',
    password: 'must|string|min:8|max:30|name=密码',
    userApplicationStatus: 'int',
    userRole: 'int',
  };

  if (that._request.userApplicationStatus == UserModel.APPLICATION_STATUS.IN_PROGRESS_MEMBER) {
    rules.wishList = 'wishList|must|array|name=意愿部门'
    rules.email = 'email|must|string|min:1|max:30|name=邮箱'
  }

  if (that._request.userRole == UserModel.ROLE.MEMBER) {
    rules.email = 'email|must|string|min:1|max:30|name=邮箱'
  }

  if (that._request.userRole == UserModel.ROLE.VISITOR) {
    rules.reason = 'formReason|must|string|min:1|max:300|name=原因'
    rules.resourceList = 'resourceList|must|array|name=可提供资源'
  }
  return rules
 }

module.exports = PassportController;