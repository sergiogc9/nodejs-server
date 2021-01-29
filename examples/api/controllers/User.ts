import { RequestHandler } from 'express';

import { Api, NOT_FOUND_ERROR } from '@sergiogc9/nodejs-server';
import { User, UserAttributes } from '../models/User';

class UserController {
	public static list: RequestHandler = async (req, res) => {
		// return Api.successResponse(req, res, [{ nice: 'awesome' }]);
		const users = await User.find();
		Api.successResponse(req, res, users);
	};

	public static get: RequestHandler = async (req, res) => {
		const userId = req.params.id;
		const user = await User.findById(userId);
		if (user) return Api.successResponse(req, res, user);
		return Api.errorResponse(req, res, 400, { code: NOT_FOUND_ERROR, message: `No user found with ID: ${userId}` });
	};

	public static findByFullName: RequestHandler = async (req, res) => {
		const fullName = req.query.name as string;
		const user = await User.findByFullName(fullName);
		if (user) return Api.successResponse(req, res, user);
		return Api.errorResponse(req, res, 400, { code: NOT_FOUND_ERROR, message: `No user found with full name: ${fullName}` });
	};

	public static create: RequestHandler = async (req, res) => {
		const userData: UserAttributes = req.body;
		if (await User.findOne({ email: userData.email })) return Api.errorResponse(req, res, 400, { code: 'EMAIL_ALREADY_EXISTS', message: 'The email already exists' });
		const user = await new User(userData).save();
		return Api.successResponse(req, res, user);
	};

	public static patch: RequestHandler = async (req, res) => {
		const userId = req.params.id;
		const userData: Partial<UserAttributes> = req.body;
		const user = await User.findById(userId);
		if (!user) return Api.errorResponse(req, res, 400, { code: NOT_FOUND_ERROR, message: `No user found with ID: ${userId}` });
		await user.set({ ...userData, _id: userId }).save();
		return Api.successResponse(req, res, user);
	};

	public static delete: RequestHandler = async (req, res) => {
		const userId = req.params.id;
		const user = await User.findById(userId);
		if (user) {
			await user.remove();
			return Api.successResponse(req, res, { deleted: 1 });
		}
		return Api.successResponse(req, res, { deleted: 0 });
	};
}

export default UserController;
