import { RequestHandler } from 'express';

import { Api, NOT_FOUND_ERROR } from '@sergiogc9/nodejs-server';
import { TeamModel, TeamSchemaAttributes } from '../models/Team';

class TeamController {
	public static list: RequestHandler = async (req, res) => {
		const includeUsers = !!req.query.users;
		const teams = await TeamModel.find();
		if (includeUsers) await TeamModel.populate(teams, { path: 'users' });
		Api.successResponse(req, res, teams);
	};

	public static get: RequestHandler = async (req, res) => {
		const includeUsers = !!req.query.users;
		const teamId = req.params.id;
		const team = await TeamModel.findById(teamId);
		if (team) {
			if (includeUsers) await TeamModel.populate(team, { path: 'users' });
			return Api.successResponse(req, res, team);
		}
		return Api.errorResponse(req, res, 400, { code: NOT_FOUND_ERROR, message: `No team found with ID: ${teamId}` });
	};

	public static create: RequestHandler = async (req, res) => {
		const teamData: TeamSchemaAttributes = req.body;
		const team = await new TeamModel(teamData).save();
		return Api.successResponse(req, res, team);
	};

	public static patch: RequestHandler = async (req, res) => {
		const teamId = req.params.id;
		const teamData: Partial<TeamSchemaAttributes> = req.body;
		const team = await TeamModel.findById(teamId);
		if (!team) return Api.errorResponse(req, res, 400, { code: NOT_FOUND_ERROR, message: `No team found with ID: ${teamId}` });
		await team.set({ ...teamData, _id: teamId }).save();
		return Api.successResponse(req, res, team);
	};

	public static delete: RequestHandler = async (req, res) => {
		const teamId = req.params.id;
		const team = await TeamModel.findById(teamId);
		if (team) {
			await team.remove();
			return Api.successResponse(req, res, { deleted: 1 });
		}
		return Api.successResponse(req, res, { deleted: 0 });
	};
}

export default TeamController;
