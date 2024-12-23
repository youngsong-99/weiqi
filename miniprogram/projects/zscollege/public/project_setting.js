module.exports = { //zscollege大学社团
	PROJECT_COLOR: '#5D94BF',
	NAV_COLOR: '#ffffff',
	NAV_BG: '#5D94BF',


	// setup
	SETUP_CONTENT_ITEMS: [
		{ title: '关于我们', key: 'SETUP_CONTENT_ABOUT' },
	],

	// 用户
	USER_REG_CHECK: false,
	USER_FIELDS: [
    { mark: 'work', title: '院系专业', type: 'text', must: false },
    { mark: 'school', title: '学校', type: 'text', must: true },
    { mark: 'department', title: '学院', type: 'text', must: true },
    { mark: 'major', title: '专业', type: 'text', must: true },
    { mark: 'class', title: '年级', type: 'text', must: true },
    { mark: 'company', title: '公司', type: 'text', must: false },
    { mark: 'position', title: '职务', type: 'text', must: false },
  ],

  MEMBER_FIELDS: [
		{ mark: 'address', title: '住址', type: 'text', must: false },
    { mark: 'work', title: '院系专业', type: 'text', must: false },
    { mark: 'location', title: '城市', type: 'text', must: true },
    { mark: 'school', title: '学校', type: 'text', must: true },
    { mark: 'department', title: '学院', type: 'text', must: true },
    { mark: 'major', title: '专业', type: 'text', must: true },
    { mark: 'class', title: '年级', type: 'text', must: true },
    { mark: 'company', title: '公司', type: 'text', must: false },
    { mark: 'position', title: '职务', type: 'text', must: false },
    { mark: 'selfIntro', title: '个人简介', type: 'textarea', must: true },
	],

	NEWS_NAME: '资讯',
	NEWS_CATE: [
		{ id: 1, title: '社团公告', style: 'leftbig1' },
		{ id: 2, title: '俱乐部', style: 'leftbig2' },
		{ id: 3, title: '俱乐部风采', style: 'flow' },

	],
	NEWS_FIELDS: [
	],


	ENROLL_NAME: '报名',
	ENROLL_CATE: [
		{ id: 1, title: '招新报名' },
		{ id: 2, title: '社团培训报名' },
		{ id: 3, title: '社团活动报名' },
	],
	ENROLL_FIELDS: [
		{ mark: 'cover', title: '封面图片', type: 'image', len: 1, must: true }, 
		{ mark: 'desc', title: '简介', type: 'textarea', max: 300, must: true },
		{ mark: 'intro', title: '详细介绍', type: 'content', must: true },

	],
	ENROLL_JOIN_FIELDS: [
		{ mark: 'name', type: 'text', title: '姓名', must: true, max: 30, edit: false },
		{ mark: 'sex', title: '性别', type: 'select', selectOptions: ['男', '女'], must: true, edit: false },
		{ mark: 'birth', type: 'date', title: '出生日期', must: true, edit: true },
		{ mark: 'phone', type: 'mobile', title: '电话号码', must: true, edit: true }, 
	],

}