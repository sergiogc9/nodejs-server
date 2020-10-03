/* eslint-disable @typescript-eslint/no-use-before-define */
import { Model, model } from 'mongoose';
import { BaseModel, BaseDocument, BaseModelConstructor, createBaseModelSchema } from 'providers/Model';

const userSchemaAttributes = {
	email: { type: String, required: true, unique: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true }
};

const userSchema = createBaseModelSchema(userSchemaAttributes);

class UserDocument extends BaseDocument {

	public email: string;
	public firstName: string;
	public lastName: string;

	getFullName() {
		return '2222';
	}

	__preSave() {
		super.__preSave();
	}

	__postSave(err: any) {
		super.__postSave(err);
	}

	static someStaticMethod(name: string) {
		const firstSpace = name.indexOf(' ');
		const firstName = name.split(' ')[0];
		const lastName = firstSpace === -1 ? '' : name.substr(firstSpace + 1);
		return UserModel.findOne({ firstName, lastName });
	}
}

userSchema.loadClass(UserDocument);

export type UserSchemaAttributes = Pick<UserDocument, keyof typeof userSchemaAttributes>;

type UserModelSchema = Model<User> & {
	new: (user: UserSchemaAttributes) => User;
	someStaticMethod: (name: string) => User;
} & BaseModelConstructor<User, keyof UserSchemaAttributes>;

export type User = BaseModel<UserDocument>;
export const UserModel = model<User, UserModelSchema>('User', userSchema);
