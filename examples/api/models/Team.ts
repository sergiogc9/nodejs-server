import { Schema, InferSchemaType, model } from 'mongoose';

const teamSchema = new Schema(
	{
		name: { type: String, required: true },
		country: { type: String, required: true },
		users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
	},
	{
		methods: {
			fullName() {
				return `${this.name} ${this.country}`;
			}
		}
	}
);

const TeamModel = model('Team', teamSchema);
type Team = InferSchemaType<typeof teamSchema>;

export { TeamModel, Team };
