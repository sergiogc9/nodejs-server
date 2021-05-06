import { RequestHandler } from 'express';
import { errorResponse, successResponse, NOT_FOUND_ERROR } from '@sergiogc9/nodejs-utils/Api';

import { Team, TeamAttributes } from '../models/Team';

class TeamController {
	public static list: RequestHandler = async (req, res) => {
		const includeUsers = !!req.query.users;
		const teams = await Team.find();
		if (includeUsers) await Team.populate(teams, { path: 'users' });
		successResponse(req, res, teams);
	};

	public static get: RequestHandler = async (req, res) => {
		const includeUsers = !!req.query.users;
		const teamId = req.params.id;
		const team = await Team.findById(teamId);
		if (team) {
			if (includeUsers) await team.populate('users');
			return successResponse(req, res, team);
		}
		return errorResponse(req, res, 400, { code: NOT_FOUND_ERROR, message: `No team found with ID: ${teamId}` });
	};

	public static create: RequestHandler = async (req, res) => {
		const teamData: TeamAttributes = req.body;
		const team = await new Team(teamData).save();
		return successResponse(req, res, team);
	};

	public static patch: RequestHandler = async (req, res) => {
		const teamId = req.params.id;
		const teamData: Partial<TeamAttributes> = req.body;
		const team = await Team.findById(teamId);
		if (!team)
			return errorResponse(req, res, 400, { code: NOT_FOUND_ERROR, message: `No team found with ID: ${teamId}` });
		await team.set({ ...teamData, _id: teamId }).save();
		return successResponse(req, res, team);
	};

	public static delete: RequestHandler = async (req, res) => {
		const teamId = req.params.id;
		const team = await Team.findById(teamId);
		if (team) {
			await team.remove();
			return successResponse(req, res, { deleted: 1 });
		}
		return successResponse(req, res, { deleted: 0 });
	};
}

export default TeamController;
