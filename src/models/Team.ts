/* eslint-disable @typescript-eslint/no-use-before-define */
import { Model, model, Schema } from 'mongoose';
import { BaseModel, BaseDocument, BaseModelConstructor, createBaseModelSchema } from '@src/providers/Model';
import { User } from './User';


const teamSchemaAttributes = {
	name: { type: String, required: true },
	country: { type: String, required: true },
	users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
};

const teamSchema = createBaseModelSchema(teamSchemaAttributes);

class TeamDocument extends BaseDocument {

	public name: string;
	public country: string;
	public users: User[];

	__preSave() {
		super.__preSave();
	}

	__postSave(err?: any) {
		super.__postSave(err);
	}
}

teamSchema.loadClass(TeamDocument);

export type TeamSchemaAttributes = Pick<TeamDocument, keyof typeof teamSchemaAttributes>;

type TeamModelSchema = Model<Team> & {
	new: (user: TeamSchemaAttributes) => Team;
} & BaseModelConstructor<Team, keyof TeamSchemaAttributes>;

export type Team = BaseModel<TeamDocument>;
export const TeamModel = model<Team, TeamModelSchema>('Team', teamSchema);
