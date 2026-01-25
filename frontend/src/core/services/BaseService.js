// local imports
import axiosClient from "@/core/api/axiosClient.js";
import {
  validateRequest,
  validateResponse,
} from "@/core/validations/validator.js";

export default class BaseService {
  constructor(resourcePath, httpClient = axiosClient) {
    this.resourcePath = resourcePath;
    this.httpClient = httpClient;
  }

  buildUrl(path = "") {
    return path
      ? `${this.resourcePath}/${path}`.replace(/([^:]\/)\/+/g, "$1")
      : this.resourcePath;
  }

  async get(path = "", options = {}) {
    const { responseSchema, config } = options;
    const response = await this.httpClient.get(this.buildUrl(path), config);
    return validateResponse(responseSchema, response.data);
  }

  async post(path = "", payload, options = {}) {
    const { requestSchema, responseSchema, config } = options;
    validateRequest(requestSchema, payload);
    const response = await this.httpClient.post(
      this.buildUrl(path),
      payload,
      config,
    );
    return validateResponse(responseSchema, response.data);
  }

  async patch(path = "", payload, options = {}) {
    const { requestSchema, responseSchema, config } = options;
    validateRequest(requestSchema, payload);
    const response = await this.httpClient.patch(
      this.buildUrl(path),
      payload,
      config,
    );
    return validateResponse(responseSchema, response.data);
  }

  async put(path = "", payload, options = {}) {
    const { requestSchema, responseSchema, config } = options;
    validateRequest(requestSchema, payload);
    const response = await this.httpClient.put(
      this.buildUrl(path),
      payload,
      config,
    );
    return validateResponse(responseSchema, response.data);
  }

  async delete(path = "", options = {}) {
    const { responseSchema, config } = options;
    const response = await this.httpClient.delete(this.buildUrl(path), config);
    return validateResponse(responseSchema, response.data);
  }
}
