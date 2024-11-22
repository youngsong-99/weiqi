const pageHelper = require('../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../helper/cloud_helper.js');
const validate = require('../../../../../helper/validate.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const projectSetting = require('../../../public/project_setting.js');
const setting = require('../../../../../setting/setting.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,
		isEdit: true,

		userRegCheck: projectSetting.USER_REG_CHECK,
    mobileCheck: setting.MOBILE_CHECK,
  
    tabs: ['普通会员', 'VIP/运营团队'],
    tabIndex: 0,

    wishItems: [
      {value: 'OPT', name: 'OPT运营中心'},
      {value: 'FRC', name: 'FRC研究中心'},
      {value: 'FPC', name: 'FPC项目中心'},
      {value: '未来梦想家', name: '未来梦想家俱乐部'},
      {value: '科技金融俱乐部', name: '科技金融俱乐部'},
      {value: '对话企业家', name: '对话企业家项目组'},
      {value: '协会顾问', name: '协会顾问'},
    ],
    resourceItems: [
      {value: '所在机构合作机会', name: '所在机构合作机会'},
      {value: '企业参访交流', name: '企业参访交流'},
      {value: '分享沙龙活动场地', name: '分享沙龙活动场地'},
      {value: '业内活动分享嘉宾', name: '业内活动分享嘉宾'},
      {value: '企业或行业赞助推广', name: '企业或行业赞助推广'},
      {value: '行业经验', name: '行业经验'},
      {value: '愿意培训在校学生有行业经验', name: '愿意培训在校学生有行业经验'},
      {value: '新媒体运营能力', name: '新媒体运营能力'},
      {value: '活动策划/组织/管理/运营能力', name: '活动策划/组织/管理/运营能力'},
      {value: '海报制作/图案设计', name: '海报制作/图案设计'},
      {value: '视频拍摄/视频处理', name: '视频拍摄/视频处理'},
      {value: '其他', name: '其他'},
    ],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		ProjectBiz.initPage(this);
		await this._loadDetail();
	},

	_loadDetail: async function (e) { 

		let opts = {
			title: 'bar'
		}
		let user = await cloudHelper.callCloudData('passport/my_detail', {}, opts);
		if (!user)
			return wx.redirectTo({ url: '../reg/my_reg' });
    
    let fields = projectSetting.USER_FIELDS
    if (user.USER_ROLE == 2) {
      fields = projectSetting.MEMBER_FIELDS
    }
    
		this.setData({
			isLoad: true,
			isEdit: true,
			user,
      fields: fields,

			formName: user.USER_NAME,
			formMobile: user.USER_MOBILE,
      formForms: user.USER_FORMS,
      formWechat: user.USER_WECHAT,
      formEmail: user.USER_EMAIL,
      formPassword: user.USER_MINI_PASSWORD,
      formConfirmPassword: user.USER_MINI_PASSWORD,
      userRole : user.USER_ROLE,
      userApplicationStatus : user.USER_APPLICATION_STATUS
    })
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: async function () {
		await this._loadDetail();
		wx.stopPullDownRefresh();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	bindGetPhoneNumber: async function (e) {
		await PassportBiz.getPhone(e, this);
	},


	bindSubmitTapUser: async function (e) {
		try {

			let data = this.data; 
      // 数据校验 
      if (this.data.userApplicationStatus == 0) {
        data = validate.check(data, PassportBiz.CHECK_USER_APPLICATION_FORM, this);
      } 

      if (this.data.userApplicationStatus == 3) {
        data = validate.check(data, PassportBiz.CHECK_USER_EDIT_FORM, this);
      }			
			if (!data) return;

			let forms = this.selectComponent("#cmpt-form").getForms(true);
			if (!forms) return;
			data.forms = forms;
      console.log(11111)
			let opts = {
				title: '提交中'
      }
      data.userApplicationStatus = this.data.userApplicationStatus
      data.userRole = this.data.userRole
      if (data.userRole == 0) {
        data.userApplicationStatus = 1
      }

			await cloudHelper.callCloudSumbit('passport/edit_base', data, opts).then(res => {
				let callback = () => {
					wx.reLaunch({ url: '../index/my_index' });
				}
				pageHelper.showSuccToast('修改成功', 1500, callback);
			});
		} catch (err) {
			console.error(err);
		}
  },

  bindSubmitTapMember: async function (e) {
    	try {
      let data = this.data; 

			// 数据校验 
      if (this.data.userApplicationStatus == 0) {
        data = validate.check(data, PassportBiz.CHECK_MEMBER_APPLICATION_FORM, this);
      } 
      
      if (this.data.userApplicationStatus == 3) {
        data = validate.check(data, PassportBiz.CHECK_MEMBER_EDIT_FORM, this);
      }	
      if (!data) return;

			let forms = this.selectComponent("#cmpt-form").getForms(true);
			if (!forms) return;
			data.forms = forms;

			let opts = {
				title: '提交中'
      }
      data.userApplicationStatus = this.data.userApplicationStatus
      data.userRole = this.data.userRole
      if (data.userRole == 0) {
        data.userApplicationStatus = 2
      }

			await cloudHelper.callCloudSumbit('passport/edit_base', data, opts).then(res => {
				let callback = () => {
					wx.reLaunch({ url: '../index/my_index' });
				}
				pageHelper.showSuccToast('修改成功', 1500, callback);
			});
		} catch (err) {
			console.error(err);
		}
  },

  checkboxChange: function (e) {

    const items = this.data.wishItems
    const values = e.detail.value
    let wishList = []
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      items[i].checked = false

      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (items[i].value === values[j]) {
          items[i].checked = true
          wishList.push(items[i])
          break
        }
      }
    }
    this.setData({
      wishList
    })
  },

  checkResueceBoxChange: function (e) {

    const items = this.data.resourceItems
    const values = e.detail.value
    let resourceList = []
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      items[i].checked = false

      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (items[i].value === values[j]) {
          items[i].checked = true
          resourceList.push(items[i])
          break
        }
      }
    }
    this.setData({
      resourceList
    })
  },

  radioChange: function (e) {
    let acceptAssign = false
    if(e.detail.value == 'assign') {
      acceptAssign = true
    }
    this.setData({
      acceptAssign
    })
  },
  
  onTabClick(e) {
    let id = e.currentTarget.id;
    console.log(this.data)
    let fields = projectSetting.USER_FIELDS
    if (id == 1) {
      fields = projectSetting.MEMBER_FIELDS
    }

    this.setData({
      tabIndex: id,
      fields: fields,
    })
  },
})