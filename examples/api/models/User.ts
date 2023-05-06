import { Schema, InferSchemaType, model } from 'mongoose';

const userSchema = new Schema(
	{
		email: { type: String, required: true, unique: true },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true }
	},
	{
		methods: {
			getFullName() {
				return `${this.firstName} ${this.lastName}`;
			}
		},
		statics: {
			findByFullName(name: string) {
				const firstSpace = name.indexOf(' ');
				const firstName = name.split(' ')[0];
				const lastName = firstSpace === -1 ? '' : name.substr(firstSpace + 1);
				return this.findOne({ firstName, lastName });
			}
		}
	}
);

const UserModel = model('User', userSchema);
type User = InferSchemaType<typeof userSchema>;

export { UserModel, User };
