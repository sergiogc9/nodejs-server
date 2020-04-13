import mongoose from '@src/providers/Database';

export type BaseModelConstructor<Model, ModelSchemaAttributes extends Partial<keyof Model>> = new (obj: Pick<Model, ModelSchemaAttributes>) => Model;
export type BaseModel<K> = K & mongoose.Document;

export abstract class BaseDocument {

	protected id: string;
	protected toObject: mongoose.Document['toObject'];

	protected __preSave() { }

	protected __postSave(err?: any) { }

	public getValues() {
		return this.toObject({
			transform: (doc, ret, options) => {
				delete ret.__v;
				ret._id = ret._id.toString();
				return ret;
			}
		});
	}

	// Implement this method in subclass if needed
	// static new(obj: any): BaseDocument {
	// 	return {} as any;
	// }
}

const enableModelHooks = (schema: mongoose.Schema) => {
	schema.pre('save', function (next) { (this as any).__preSave(); next(); });
	schema.post('save', function (doc, next) { (this as any).__postSave(); next(); });
	schema.post('save', function (error: any, doc: mongoose.Document, next: mongoose.HookNextFunction) { (this as any).__postSave(error); next(); });
};

export const createBaseModelSchema = (schemaAttributes: mongoose.SchemaDefinition, schemaOptions?: mongoose.SchemaOptions) => {
	const schema = new mongoose.Schema(schemaAttributes, schemaOptions);
	enableModelHooks(schema);
	return schema;
};
