'use strict';

const Account = require('../models/Account');
const Department = require('../models/Department');
const password = require('./password');
const Render = require('../render'),
	render = Render.render;

const logger = require('./logger');
const moment = require('moment');

const getRegexp = (string) => {
	let str = string.replace(/\[/g, '');

	str = str.replace(/\]/g, '');
	str = str.replace(/\\/g, '');
	str = str.replace(/\(/g, '');
	str = str.replace(/\)/g, '');

	return new RegExp('' + str + '', 'i');
}

module.exports = {

	getPage: async (req, res) => {
		const search = req.query.name || '';
		const query = { status: true };

		if (search) {
			query['$or'] = [
				{ name: { $regex: getRegexp(search) }},
				{ login: { $regex: getRegexp(search) }}
			];
		}

		const accounts = await Account
			.find(query)
			.populate('department')
			.sort({ lastVisit: -1 })
			.lean();


		res.locals.query = req.query;
		res.locals.users = accounts.map((user) => {
			const lastVisit = user.lastVisit && moment(user.lastVisit);

			if (lastVisit) {
				const isOnline = moment().diff(lastVisit, 'minutes') <= 5;
				const isExpired = moment().diff(lastVisit, 'days') >= 90;

				return { ...user, isOnline, isExpired }
			}

			return user
 		});

		render(req, res, {
			viewName: 'users',
			options: {
				reqUrl: '/admin/users'
			}
		});

	},

	getPageCreate: async (req, res) => {
		res.locals.departments = await Department.find({ status: true });

		render(req, res, {
			viewName: 'user',
			options: {
				page: 'create'
			}
		});
	},

	getOne: async (req, res) => {
		res.locals.user = await Account.findOne({ login: req.params.login, status: true });
		res.locals.departments = await Department.find({ status: true });

		render(req, res, {
			viewName: 'user',
			options: {
				page: 'edit'
			}
		});
	},

	getProfile: async (req, res) => {
		res.locals.user = await Account.findOne({ login: res.locals.__user.login, status: true }).populate('department');
		res.locals.departments = await Department.find({ status: true });

		render(req, res, {
			viewName: 'user',
			options: {
				page: 'profile'
			}
		});
	},

	create: async (req, res) => {
		var reqData = req.body,
			errors = [];

		reqData.login = reqData.login.toLowerCase();

		if (await Account.findOne({ login: reqData.login }))
			{errors.push({ errText: 'Пользователь с таким логином уже существует!' })}

		if (!reqData.name) errors.push({ errText: 'Ф.И.О. - обязательное поле!' })
		errors = validate(reqData, errors);

		var settings = {}

		var department = await Department.findOne({ _id: reqData.department });

		switch (department.type) {
			case 'admin':
				settings.main = {
					initiators: [],
					zone: [],
					stage: []
				};
				break;
			case 'b2b':
				settings.main = {
					initiators: [department._id],
					zone: [],
					stage: ['client-match', 'client-notify']
				};
				break;
			case 'b2o':
				settings.main = {
					initiators: [department._id],
					zone: [],
					stage: ['client-match', 'client-notify', 'stop-pre', 'stop-build']
				};
				break;
			case 'network':
				settings.main = {
					initiators: [],
					zone: [],
					stage: ['network']
				};
				break;
			case 'gus':
				settings.main = {
					initiators: [],
					zone: [department._id],
					stage: ['gzp-pre', 'gzp-build', 'install-devices']
				};
				break;
		}

		if (errors.length === 0) {
			var acc = new Account({
				login: reqData.login,
				password: password.createHash(reqData.password),
				name: reqData.name,
				email: reqData.email,
				phone: reqData.phone,
				department: reqData.department,
				status: true,
				settings: settings,
				created: new Date(),
			});
			var result = await acc.save();
		} else res.status(400).send(errors);

		if (result) {
			logger.info(`Created user ${acc.login}`, res.locals.__user);
			res.send({ ok: 'ok' });
		}

	},

	edit: async (req, res) => {
		var acc = await Account.findOne({ login: req.params.login });
		var reqData = req.body;

		acc.name = reqData.name;

		if (reqData.name == '') {
			res.status(400).send({ errText: 'Ф.И.О. - обязательное поле!' });
			return;
		}

		acc.email = reqData.email;
		acc.phone = reqData.phone;
		acc.department = await Department.findOne({ _id: reqData.department });

		if (reqData.password != '' || reqData.passwordRep != '') {
			if (reqData.password == '' || reqData.passwordRep == '') {
				res.status(400).send({
					errText: 'Для изменения пароля заполните поля "Пароль" и "Повторите пароль".' +
						' Если вы не собираетесь изменять пароль, то оставьте эти поля пустыми'
				})
				return;
			}
			if (reqData.password != reqData.passwordRep) {
				res.status(400).send({ errText: 'Пароли не совпадают!' })
				return;
			}
			acc.password = password.createHash(reqData.password)
		}

		var result = await acc.save();
		if (result) {
			logger.info(`Edit account ${req.params.login}`, res.locals.__user);
			res.send({ ok: 'ok' });
		}
	},

	selfEdit: async (req, res) => {
		var acc = await Account.findOne({ login: res.locals.__user.login });
		var reqData = req.body;

		acc.email = req.body.email;
		acc.name = req.body.name;
		acc.phone = req.body.phone;

		if (reqData.name == '') {
			res.status(400).send({ errText: 'Ф.И.О. - обязательное поле!' });
			return;
		}

		if (reqData.password != '' || reqData.passwordRep != '' || reqData.passwordOld != '') {
			if (reqData.password == '' || reqData.passwordRep == '' || reqData.passwordOld == '') {
				res.status(400).send({
					errText: 'Заполните поля "Текущий пароль", "Пароль" и "Повторите пароль".' +
						' Если вы не собираетесь изменять пароль, то оставьте эти поля пустыми'
				})
				return;
			}
			if (reqData.password != reqData.passwordRep) {
				res.status(400).send({ errText: 'Пароли не совпадают!' })
				return;
			}
			if (password.createHash(reqData.passwordOld) != acc.password) {
				res.status(400).send({
					errText: `Текущий пароль введен не верно!
                    Если вы забыли текущий пароль - обратитесь к администратору!`});
				return;
			}
			acc.password = password.createHash(reqData.password)
		}
		acc.settings.main.initiators = reqData.initiators || [];
		acc.settings.main.zone = reqData.zone || [];
		acc.settings.main.stage = reqData.stage || [];

		if (reqData.sendEmail == '1') {
			acc.settings.sendEmail = true;
		} else {
			acc.settings.sendEmail = false;
		}

		var result = await acc.save();

		if (result) {
			logger.info(`Edit profile ${res.locals.__user.login}`, res.locals.__user);
			res.send({ ok: 'ok' });
		}

	},

	passEdit: async (req, res) => {
		var acc = await Account.findOne({ login: req.params.login });

		if (acc && req.body.password === req.body.passwordRep) {
			acc.password = password.createHash(req.body.password);
			var result = await acc.save();
		} else {
			res.status(400).send([{ errText: 'Пароли не совпадают!' }]);
		}

		if (result) {
			logger.info(`Edit password ${req.params.login}`, res.locals.__user);
			res.send({ ok: 'ok' });
		}

	},

	selfPassEdit: async (req, res) => {
		var acc = await Account.findOne({
			login: res.locals.__user.login,
			password: password.createHash(req.body.passwordOld)
		});

		if (acc) {

			if (req.body.password === req.body.passwordRep) {
				acc.password = password.createHash(req.body.password);
				var result = await acc.save();
			} else res.status(400).send([{ errText: 'Пароли не совпадают!' }]);

		} else res.status(400).send([{ errText: 'Неверный пароль!' }]);
		if (result) {
			logger.info(`Edit profile password`, res.locals.__user);
			res.send({ ok: 'ok' });
		}

	},

	delete: async (req, res) => {
		var acc = await Account.findOne({
			login: req.params.login
		});

		acc.login = Date.now() + acc.login;
		acc.status = false;

		var result = await acc.save();
		if (result) {
			res.status(200).send({ url: '/admin/users' });
			return;
		} else {
			res.status(400).send('Что-то пошло не так...');
			return;
		}
	},

	settings: async (req, res) => {

		var acc = await Account.findOne({ login: res.locals.__user.login }),
			reqData = req.body,
			tab = req.params.tab;

		switch (tab) {
			case 'main-page':
				acc.settings.main.zone = reqData.zone || [];
				acc.settings.main.stage = reqData.stage || [];
				break;
			case 'table':
				acc.settings.table.perPage = +reqData.perPage || 50;
			default:

		}

		acc.save();

		res.status(200).send({});
	}
};

function validate(user, errs) {

	if (!/^[a-zA-Z][a-zA-Z0-9_]+$/.test(user.login)) errs.push({ errText: 'Неверный формат логина' });

	if (user.password != user.passwordRep) errs.push({ errText: 'Пароли не совпадают' });

	return errs;
}
