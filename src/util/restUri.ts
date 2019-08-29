import { RestClient } from 'typed-rest-client';
import { BasicCredentialHandler } from 'typed-rest-client/Handlers';
import { IRequestOptions } from 'typed-rest-client/Interfaces';
import { HttpCodes } from 'typed-rest-client/HttpClient';

export class RestUri {
	public parts = new Array<string>();
	public args = new Map<string, any>();

	public constructor(private base: string, ...parts: string[]) {
		for (var i = 0; i < parts.length; i++) {
			this.parts.push(parts[i]);
		}
	}

	public setArg(key: string, value: any | any[]) {
		if (Array.isArray(value)) {
			value.forEach((v) => this.args.set(key, v));
		} else {
			this.args.set(key, value);
		}
		return this;
	}

	public addPart(part: string) {
		this.parts.push(part);
		return this;
	}

	public str(): string {
		let parts = this.parts.map((p) => encodeURI(p));
		parts.unshift(this.base);
		let url = parts.join('/');
		let urlParams = new Array<string>();
		this.args.forEach((k, v) => {
			urlParams.push(`${encodeURI(k)}=${encodeURI(v)}`);
		});
		if (urlParams.length > 0) {
			url += '?' + urlParams.join('&');
		}
		return url;
	}

	public get<T>(
		id: string,
		host: string,
		authHandlers: BasicCredentialHandler[],
		queryOptions: IRequestOptions
	): Promise<T> {
		let client = new RestClient(id, host, authHandlers, queryOptions);
		return new Promise((resolve, reject) => {
			client
				.get<T>(this.str())
				.then((response) => {
					if (response.statusCode == HttpCodes.OK && response.result) {
						resolve(response.result);
					}
					reject();
				})
				.catch((e) => {
					reject();
				});
		});
	}
}
