const pageHelper = require('../../../../../helper/page_helper.js');
const helper = require('../../../../../helper/helper.js');
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
    isEdit: false,

    items: [
      {value: 'OPT', name: 'OPT运营中心'},
      {value: 'FRC', name: 'FRC研究中心'},
      {value: 'FPC', name: 'FPC项目中心'},
      {value: '未来梦想家', name: '未来梦想家俱乐部'},
      {value: '科技金融俱乐部', name: '科技金融俱乐部'},
      {value: '对话企业家', name: '对话企业家项目组'},
      {value: '协会顾问', name: '协会顾问'},
    ],

		mobileCheck: setting.MOBILE_CHECK
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {

		ProjectBiz.initPage(this);

		if (options && options.retUrl)
			this.data.retUrl = decodeURIComponent(options.retUrl);

		await this._loadDetail();
	},

	_loadDetail: async function (e) { 
		let opts = {
			title: 'bar'
    }

    let user = await cloudHelper.callCloudData('passport/my_detail', {}, opts);

		// if (user) {
		// 	return wx.redirectTo({ url: '../index/my_index' });
		// }

		this.setData({
			isLoad: true,

			fields: projectSetting.USER_FIELDS,

      formName: '',
      formMobile: '',
      formResource: '',
			formForms: []
		});
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
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	bindGetPhoneNumber: async function (e) {
		PassportBiz.getPhone(e, this);
	},


	bindSubmitTap: async function (e) {
		try {
			let data = this.data;
 
			// 数据校验 
			data = validate.check(data, PassportBiz.CHECK_FORM, this);
      if (!data) return;

			let forms = this.selectComponent("#cmpt-form").getForms(true);
			if (!forms) return;
      data.forms = forms;

      data.status = projectSetting.USER_REG_CHECK ? 0 : 1;
      data.acceptAssign = this.data.acceptAssign
      data.wishList = this.data.wishList
			let opts = {
				title: '提交中'
			}
			await cloudHelper.callCloudSumbit('passport/register', data, opts).then(result => {
				if (result && helper.isDefined(result.data.token) && result.data.token) {
					// 用户需要审核，不能登录
					if (!projectSetting.USER_REG_CHECK) PassportBiz.setToken(result.data.token);

					let callback = () => {
						if (this.data.retUrl == 'back')
							wx.navigateBack();
						else if (this.data.retUrl)
							wx.redirectTo({
								url: this.data.retUrl,
							})
            else
						wx.reLaunch({ url: '../index/my_index' });
					}

					if (projectSetting.USER_REG_CHECK)
						pageHelper.showModal('注册完成，等待系统审核', '温馨提示', callback);
					else
					pageHelper.showSuccToast('注册成功', 1500, callback);
				}
			});
		} catch (err) {
			console.error(err);
		}
  },
  
  checkboxChange: function (e) {

    const items = this.data.items
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

  radioChange: function (e) {
    let acceptAssign = false
    if(e.detail.value == 'assign') {
      acceptAssign = true
    }
    this.setData({
      acceptAssign
    })
  }

})