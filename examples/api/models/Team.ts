/* eslint-disable @typescript-eslint/no-use-before-define */
import { Schema } from 'mongoose';
import { BaseDocument, createModel, Document } from '@sergiogc9/nodejs-utils/Model';

import { UserDocument } from './User';

const teamSchemaDefinition = {
	name: { type: String, required: true },
	country: { type: String, required: true },
	users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
};

class TeamBaseDocument extends BaseDocument {

	public name: string;
	public country: string;
	public users: UserDocument[] | string[];

	_preSave() {
		super._preSave();
	}

	_postSave(err?: any) {
		super._postSave(err);
	}
}

type TeamDocument = Document<TeamBaseDocument>;
type TeamAttributes = Pick<TeamDocument, keyof typeof teamSchemaDefinition>;

const Team = createModel<TeamBaseDocument, TeamAttributes>('Team', TeamBaseDocument, teamSchemaDefinition);

export { Team, TeamAttributes, TeamDocument };
export default Team;
