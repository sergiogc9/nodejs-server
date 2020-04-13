import { RequestHandler } from 'express';

import Api, { NOT_FOUND_ERROR } from '@src/api/Api';
import { UserModel, UserSchemaAttributes } from '@src/models/User';

class UserController {
	public static list: RequestHandler = async (req, res) => {
		const users = await UserModel.find();
		Api.successResponse(req, res, users);
	};

	public static get: RequestHandler = async (req, res) => {
		const userId = req.params.id;
		const user = await UserModel.findById(userId);
		if (user) return Api.successResponse(req, res, user);
		return Api.errorResponse(req, res, 400, { code: NOT_FOUND_ERROR, message: `No user found with ID: ${userId}` });
	};

	public static create: RequestHandler = async (req, res) => {
		const userData: UserSchemaAttributes = req.body;
		if (await UserModel.findOne({ email: userData.email })) return Api.errorResponse(req, res, 400, { code: 'EMAIL_ALREADY_EXISTS', message: 'The email already exists' });
		const user = await new UserModel(userData).save();
		return Api.successResponse(req, res, user);
	};

	public static patch: RequestHandler = async (req, res) => {
		const userId = req.params.id;
		const userData: Partial<UserSchemaAttributes> = req.body;
		const user = await UserModel.findById(userId);
		if (!user) return Api.errorResponse(req, res, 400, { code: NOT_FOUND_ERROR, message: `No user found with ID: ${userId}` });
		await user.set({ ...userData, _id: userId }).save();
		return Api.successResponse(req, res, user);
	};

	public static delete: RequestHandler = async (req, res) => {
		const userId = req.params.id;
		const user = await UserModel.findById(userId);
		if (user) {
			await user.remove();
			return Api.successResponse(req, res, { deleted: 1 });
		}
		return Api.successResponse(req, res, { deleted: 0 });
	};
}

export default UserController;
