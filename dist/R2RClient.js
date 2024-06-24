"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.R2RClient = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const posthog_js_1 = __importDefault(require("posthog-js"));
const feature_1 = require("./feature");
class R2RClient {
    constructor(baseURL, prefix = "/v1") {
        this.baseUrl = `${baseURL}${prefix}`;
        this.axiosInstance = axios_1.default.create({
            baseURL: this.baseUrl,
            headers: {
                "Content-Type": "application/json",
            },
            transformRequest: [
                (data) => {
                    if (typeof data === "string") {
                        return data;
                    }
                    return JSON.stringify(data);
                },
            ],
        });
    }
    healthCheck() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.get("/health");
            return response.data;
        });
    }
    updatePrompt(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.post("/update_prompt", request);
            return response.data;
        });
    }
    ingestDocuments(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.post("/ingest_documents", request);
            return response.data;
        });
    }
    ingestFiles(files, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = new form_data_1.default();
            files.forEach((file) => {
                formData.append("files", file);
            });
            Object.entries(request).forEach(([key, value]) => {
                formData.append(key, JSON.stringify(value));
            });
            const response = yield this.axiosInstance.post("/ingest_files", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                transformRequest: [
                    (data, headers) => {
                        delete headers["Content-Type"];
                        return data;
                    },
                ],
            });
            return response.data;
        });
    }
    updateDocuments(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.post("/update_documents", request);
            return response.data;
        });
    }
    updateFiles(files, documentIds, metadatas) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = new form_data_1.default();
            files.forEach((file) => {
                formData.append("files", file);
            });
            formData.append("document_ids", JSON.stringify(documentIds));
            if (metadatas) {
                formData.append("metadatas", JSON.stringify(metadatas));
            }
            const response = yield this.axiosInstance.post("/update_files", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                transformRequest: [
                    (data, headers) => {
                        delete headers["Content-Type"];
                        return data;
                    },
                ],
            });
            return response.data;
        });
    }
    search(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.post("/search", request);
            return response.data;
        });
    }
    rag(request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if ((_a = request.rag_generation_config) === null || _a === void 0 ? void 0 : _a.stream) {
                return this.streamRag(request);
            }
            else {
                const response = yield this.axiosInstance.post("/rag", JSON.stringify(request));
                return response.data;
            }
        });
    }
    streamRag(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.post("/rag", JSON.stringify(request), {
                responseType: "stream",
            });
            return response.data;
        });
    }
    delete(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance({
                method: "delete",
                url: "/delete",
                data: {
                    keys: request.keys,
                    values: request.values,
                },
                headers: { "Content-Type": "application/json" },
            });
            return response.data;
        });
    }
    logs(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = Object.assign(Object.assign({}, request), { log_type_filter: request.log_type_filter === undefined ? null : request.log_type_filter, max_runs_requested: request.max_runs_requested || 100 });
            const response = yield this.axiosInstance.post("/logs", payload, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        });
    }
    appSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.get("/app_settings");
            return response.data;
        });
    }
    analytics(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.post("/analytics", request, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            posthog_js_1.default.capture("TSClient", { requestType: "analytics success" });
            return response.data;
        });
    }
    usersOverview(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.get("/users_overview", {
                params: request,
            });
            return response.data;
        });
    }
    documentsOverview(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.post("/documents_overview", request, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        });
    }
    documentChunks(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.post("/document_chunks", request, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            posthog_js_1.default.capture("TSClient", { requestType: "documentChunks success" });
            return response.data;
        });
    }
}
exports.R2RClient = R2RClient;
__decorate([
    (0, feature_1.feature)("updatePrompt")
], R2RClient.prototype, "updatePrompt", null);
__decorate([
    (0, feature_1.feature)("ingestDocuments")
], R2RClient.prototype, "ingestDocuments", null);
__decorate([
    (0, feature_1.feature)("ingestFiles")
], R2RClient.prototype, "ingestFiles", null);
__decorate([
    (0, feature_1.feature)("updateDocuments")
], R2RClient.prototype, "updateDocuments", null);
__decorate([
    (0, feature_1.feature)("updateFiles")
], R2RClient.prototype, "updateFiles", null);
__decorate([
    (0, feature_1.feature)("search")
], R2RClient.prototype, "search", null);
__decorate([
    (0, feature_1.feature)("rag")
], R2RClient.prototype, "rag", null);
__decorate([
    (0, feature_1.feature)("streamingRag")
], R2RClient.prototype, "streamRag", null);
__decorate([
    (0, feature_1.feature)("delete")
], R2RClient.prototype, "delete", null);
__decorate([
    (0, feature_1.feature)("logs")
], R2RClient.prototype, "logs", null);
__decorate([
    (0, feature_1.feature)("appSettings")
], R2RClient.prototype, "appSettings", null);
__decorate([
    (0, feature_1.feature)("analytics")
], R2RClient.prototype, "analytics", null);
__decorate([
    (0, feature_1.feature)("usersOverview")
], R2RClient.prototype, "usersOverview", null);
__decorate([
    (0, feature_1.feature)("documentsOverview")
], R2RClient.prototype, "documentsOverview", null);
__decorate([
    (0, feature_1.feature)("documentChunks")
], R2RClient.prototype, "documentChunks", null);
exports.default = R2RClient;
