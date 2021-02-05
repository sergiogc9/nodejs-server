/* eslint-disable @typescript-eslint/no-use-before-define */
import { BaseDocument, createModel, Document } from '@sergiogc9/nodejs-utils/Model';

const userSchemaDefinition = {
	email: { type: String, required: true, unique: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true }
};

class UserBaseDocument extends BaseDocument {

	public email: string;
	public firstName: string;
	public lastName: string;

	getFullName() {
		return '2222';
	}

	_preSave() {
		super._preSave();
	}

	_postSave(err: any) {
		super._postSave(err);
	}

	static findByFullName(name: string) {
		const firstSpace = name.indexOf(' ');
		const firstName = name.split(' ')[0];
		const lastName = firstSpace === -1 ? '' : name.substr(firstSpace + 1);
		return User.findOne({ firstName, lastName });
	}
}

type UserDocument = Document<UserBaseDocument>;
type UserAttributes = Pick<UserBaseDocument, keyof typeof userSchemaDefinition>;
type UserStaticMethods = {
	findByFullName: typeof UserBaseDocument['findByFullName']
};

const User = createModel<UserBaseDocument, UserAttributes, UserStaticMethods>('User', UserBaseDocument, userSchemaDefinition);

export { User, UserAttributes, UserDocument };
export default User;
