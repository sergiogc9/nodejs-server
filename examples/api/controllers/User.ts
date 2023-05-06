import { RequestHandler } from 'express';
import { errorResponse, successResponse, NOT_FOUND_ERROR } from '@sergiogc9/nodejs-utils/Api';

import { User, UserModel } from '../models/User';

class UserController {
	public static list: RequestHandler = async (req, res) => {
		// return successResponse(req, res, [{ nice: 'awesome' }]);
		const users = await UserModel.find();
		successResponse(req, res, users);
	};

	public static get: RequestHandler = async (req, res) => {
		const userId = req.params.id;
		const user = await UserModel.findById(userId);
		if (user) return successResponse(req, res, user);
		return errorResponse(req, res, 400, { code: NOT_FOUND_ERROR, message: `No user found with ID: ${userId}` });
	};

	public static findByFullName: RequestHandler = async (req, res) => {
		const fullName = req.query.name as string;
		const user = await UserModel.findByFullName(fullName);
		if (user) return successResponse(req, res, user);
		return errorResponse(req, res, 400, {
			code: NOT_FOUND_ERROR,
			message: `No user found with full name: ${fullName}`
		});
	};

	public static create: RequestHandler = async (req, res) => {
		const userData: User = req.body;
		if (await UserModel.findOne({ email: userData.email }))
			return errorResponse(req, res, 400, { code: 'EMAIL_ALREADY_EXISTS', message: 'The email already exists' });
		const user = await new UserModel(userData).save();
		return successResponse(req, res, user);
	};

	public static patch: RequestHandler = async (req, res) => {
		const userId = req.params.id;
		const userData: Partial<User> = req.body;
		const user = await UserModel.findById(userId);
		if (!user)
			return errorResponse(req, res, 400, { code: NOT_FOUND_ERROR, message: `No user found with ID: ${userId}` });
		await user.set({ ...userData, _id: userId }).save();
		return successResponse(req, res, user);
	};

	public static delete: RequestHandler = async (req, res) => {
		const userId = req.params.id;
		const user = await UserModel.findById(userId);
		if (user) {
			await user.deleteOne();
			return successResponse(req, res, { deleted: 1 });
		}
		return successResponse(req, res, { deleted: 0 });
	};
}

export default UserController;
