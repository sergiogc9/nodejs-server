import mongoose from 'mongoose';

type DocAttributes = Record<string, unknown>;
type Document<T extends BaseDocument> = T & mongoose.Document;
type DocumentClass<T extends BaseDocument> = { new (doc: any): T };

interface Model<T extends BaseDocument, U extends DocAttributes> extends Omit<mongoose.Model<Document<T>>, 'new'> {
	new (doc: U): Document<T>;
	create(doc: U): Promise<Document<T>>;
	create(docs: U[]): Promise<Document<T>[]>;
}

abstract class BaseDocument {
	// Needed to be used in getValues as we can not extend from mongoose.Document
	protected toObject: mongoose.Document['toObject'];

	protected _preSave() {}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected _postSave(err?: any) {}

	public getValues() {
		return this.toObject({
			transform: (doc, ret) => {
				delete ret.__v;
				ret._id = ret._id.toString();
				return ret;
			}
		});
	}
}

const enableModelHooks = (schema: mongoose.Schema) => {
	schema.pre('save', next => {
		(this as any)._preSave();
		next();
	});
	schema.post('save', (doc, next) => {
		(this as any)._postSave();
		next();
	});
	schema.post('save', (error: any, doc: mongoose.Document, next: mongoose.HookNextFunction) => {
		(this as any)._postSave(error);
		next();
	});
};

const createModelSchema = (schemaAttributes: mongoose.SchemaDefinition, schemaOptions?: mongoose.SchemaOptions) => {
	const schema = new mongoose.Schema(schemaAttributes, schemaOptions);
	enableModelHooks(schema);
	return schema;
};

const createModel = <
	T extends BaseDocument,
	U extends DocAttributes,
	StaticMethods extends Record<string, any> = unknown
>(
	name: string,
	modelClass: DocumentClass<T>,
	schemaDefinition: Record<string, unknown>
) => {
	const schema = createModelSchema(schemaDefinition);
	schema.loadClass(modelClass);
	return mongoose.model<Document<T>>(name, schema) as Model<T, U> & StaticMethods;
};

const { Schema } = mongoose;

export { BaseDocument, createModel, Document, Schema };
