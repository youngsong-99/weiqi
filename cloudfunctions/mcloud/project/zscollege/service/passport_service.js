/**
 * Notes: passport模块业务逻辑 
 * Date: 2020-10-14 07:48:00 
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY wenxiao song Weiqi (wechat)
 */

const BaseProjectService = require('./base_project_service.js');
const cloudBase = require('../../../framework/cloud/cloud_base.js');
const UserModel = require('../model/user_model.js');
const dataUtil = require('../../../framework/utils/data_util.js');

class PassportService extends BaseProjectService {

	// 注册
	async register(userId, {
		mobile,
		name,
		forms,
    status,
    weChat,
    reason,
    resource,
    email,
    wishList,
    acceptAssign,
    password,
	}) {
    // 判断是否存在

		let where = {
			USER_MINI_OPENID: userId
		}
    let cnt = await UserModel.count(where);

		if (cnt > 0)
			return await this.login(userId);

		where = {
			USER_MOBILE: mobile
		}
		cnt = await UserModel.count(where);
		if (cnt > 0) this.AppError('该手机已注册');

		// 入库
		let data = {
			USER_MINI_OPENID: userId,
			USER_MOBILE: mobile,
			USER_NAME: name,
			USER_OBJ: dataUtil.dbForms2Obj(forms),
			USER_FORMS: forms,
      USER_STATUS: Number(status),
      USER_WECHAT: weChat,
      USER_EMAIL: email,
      USER_REASON: reason,
      USER_RESOURCE: resource,
      USER_WISHLIST: wishList,
      USER_ACCEPTASSIGN: acceptAssign,
      USER_MINI_PASSWORD: password,
      USER_PRIVACY: false,
		}
		await UserModel.insert(data);

		return await this.login(userId);
  }
  
  	// 微信注册
	async registerWithWechatNickName(userId,
		wechatNickName
	) {
    // 判断是否存在

		let where = {
			USER_MINI_OPENID: userId
		}
    let cnt = await UserModel.count(where);

		if (cnt > 0)
			return await this.login(userId);
    console.log(wechatNickName)
		// 入库
		let data = {
			USER_MINI_OPENID: userId,
			USER_WECHAT_NICKNAME: wechatNickName,
      USER_PRIVACY: false,
      USER_ROLE:0,
		}
		await UserModel.insert(data);

		return await this.login(userId);
	}

	/** 获取手机号码 */
	async getPhone(cloudID) {
		let cloud = cloudBase.getCloud();
		let res = await cloud.getOpenData({
			list: [cloudID], // 假设 event.openData.list 是一个 CloudID 字符串列表
		});
		if (res && res.list && res.list[0] && res.list[0].data) {

			let phone = res.list[0].data.phoneNumber;

			return phone;
		} else
			return '';
	}

	/** 取得我的用户信息 */
	async getMyDetail(userId) {
		let where = {
			USER_MINI_OPENID: userId
		}
		let fields = 'USER_MOBILE,USER_NAME,USER_FORMS,USER_OBJ,USER_STATUS,USER_CHECK_REASON,USER_EMAIL,USER_MINI_PASSWORD,USER_WECHAT,USER_WECHAT_NICKNAME,USER_ROLE,USER_APPLICATION_STATUS'
		return await UserModel.getOne(where, fields);
	}

	/** 修改用户资料 */
	async editBase(userId, {
		mobile,
		name,
    forms,
    email,
    weChat,
    password,
    userApplicationStatus,
    wishList,
    resourceList,
    reason,
    userRole
	}) {
		let whereMobile = {
			USER_MOBILE: mobile,
			USER_MINI_OPENID: ['<>', userId]
		}
		let cnt = await UserModel.count(whereMobile);
		if (cnt > 0) this.AppError('该手机已注册');

		let where = {
			USER_MINI_OPENID: userId
		}

		let user = await UserModel.getOne(where);
		if (!user) return;

		let data = {
			USER_MOBILE: mobile,
			USER_NAME: name,
			USER_OBJ: dataUtil.dbForms2Obj(forms),
      USER_FORMS: forms,
      USER_WECHAT: weChat,
      USER_MINI_PASSWORD: password,
      USER_APPLICATION_STATUS:userApplicationStatus,
      USER_ROLE:userRole,
    };

    if (userApplicationStatus == UserModel.APPLICATION_STATUS.IN_PROGRESS_MEMBER || userApplicationStatus == UserModel.APPLICATION_STATUS.IN_PROGRESS_USER) {
      data.USER_REASON = reason
      data.USER_RESOURCELIST = resourceList
    }

    if (userApplicationStatus == UserModel.APPLICATION_STATUS.IN_PROGRESS_MEMBER) {
      data.USER_EMAIL = email
      data.USER_WISHLIST = wishList
    }

    if (userRole == UserModel.ROLE.MEMBER) {
      data.USER_EMAIL = email
    }

		if (user.USER_STATUS == UserModel.STATUS.UNCHECK)
      data.USER_STATUS = UserModel.STATUS.UNUSE;

		await UserModel.edit(where, data);

	}

	/** 登录 */
	async login(userId) {

		let where = {
			'USER_MINI_OPENID': userId
		};
		let fields = 'USER_ID,USER_MINI_OPENID,USER_NAME,USER_PIC,USER_STATUS,USER_WECHAT,USER_EMAIL,USER_REASON,USER_RESOURCE,USER_WECHAT_NICKNAME,USER_ROLE,USER_APPLICATION_STATUS';
		let user = await UserModel.getOne(where, fields);
    let token = {};

    console.log(userId)
		if (user) {

			// 正常用户
			token.id = user.USER_MINI_OPENID;
			token.key = user.USER_ID;
			token.name = user.USER_NAME;
			token.pic = user.USER_PIC;
      token.status = user.USER_STATUS;
      token.weChat = user.USER_WECHAT;
      token.email = user.USER_EMAIL;
      token.reason = user.USER_REASON;
      token.resource = user.USER_RESOURCE;
      token.userWechatNickname = user.USER_WECHAT_NICKNAME;
      token.userRole = user.USER_ROLE;
      token.userApplicationStatus = user.USER_APPLICATION_STATUS;

			// 异步更新最近更新时间
			let dataUpdate = {
				USER_LOGIN_TIME: this._timestamp
			};
			UserModel.edit(where, dataUpdate);
			UserModel.inc(where, 'USER_LOGIN_CNT', 1);

		} else
			token = null;

		return {
			token
		};
  }

  /** 登录 */
	async loginWithWechat(wechat) {

		let where = {
      'USER_WECHAT_NICKNAME':wechat
		};
		let fields = 'USER_ID,USER_MINI_OPENID,USER_NAME,USER_PIC,USER_STATUS,USER_WECHAT,USER_EMAIL,USER_REASON,USER_RESOURCE,USER_WECHAT_NICKNAME,USER_ROLE,USER_APPLICATION_STATUS';
    let user = await UserModel.getOne(where, fields);
    let token = {}
		
    if (user) {
      setUserInfo(user, token, where)	
    } else {
			token = null;
    }

		return {
			token
		};
	}
  
  /** 登录 */
	async loginWithPassWord(account, password) {

		let where = {
      'USER_MOBILE':account
		};
		let fields = 'USER_ID,USER_MINI_OPENID,USER_NAME,USER_PIC,USER_STATUS,USER_WECHAT,USER_EMAIL,USER_REASON,USER_RESOURCE,USER_WECHAT_NICKNAME,USER_ROLE,USER_APPLICATION_STATUS';
    let user = await UserModel.getOne(where, fields);
    let token = {}
		if (user == null) {
      where = {
        'USER_EMAIL':account
      };
      user = await UserModel.getOne(where, fields);
		} 
    
    if (user) {
      setUserInfo(user, token, where)	
    } else {
			token = null;
    }
		return {
			token
		};
	}

}

function setUserInfo(user, token, where) {
  	// 正常用户
    token.id = user.USER_MINI_OPENID;
    token.key = user.USER_ID;
    token.name = user.USER_NAME;
    token.pic = user.USER_PIC;
    token.status = user.USER_STATUS;
    token.weChat = user.USER_WECHAT;
    token.email = user.USER_EMAIL;
    token.reason = user.USER_REASON;
    token.resource = user.USER_RESOURCE;
    token.wechatNickName = user.USER_WECHAT_NICKNAME;
    token.userRole= user.USER_ROLE;
    token.userApplicationStatus = user.USER_APPLICATION_STATUS;

    // 异步更新最近更新时间
    let dataUpdate = {
      USER_LOGIN_TIME: this._timestamp
    };
    UserModel.edit(where, dataUpdate);
    UserModel.inc(where, 'USER_LOGIN_CNT', 1);
}

module.exports = PassportService;