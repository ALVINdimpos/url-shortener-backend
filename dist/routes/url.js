"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const models_1 = require("../models");
const uuid_1 = require("uuid");
const is_loggedin_1 = require("../middleware/is_loggedin");
const router = (0, express_1.Router)();
// Shorten a URL
router.post("/shorten", is_loggedin_1.isLoggedIn, (0, express_async_handler_1.default)(async (req, res) => {
    var _a;
    const { long_url } = req.body;
    const short_code = (0, uuid_1.v4)().substring(0, 6);
    const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!user_id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const url = await models_1.Url.create({
        long_url,
        short_code,
        user_id,
    });
    res.status(201).json({
        data: url,
        message: "URL shortened successfully",
    });
}));
// Get URL by short code
router.get("/:short_code", (0, express_async_handler_1.default)(async (req, res) => {
    const { short_code } = req.params;
    const url = await models_1.Url.findOne({ where: { short_code } });
    if (url) {
        // Increment clicks
        url.clicks = (url.clicks || 0) + 1;
        await url.save();
        res.status(200).json({
            data: url,
            message: "URL found successfully",
        });
    }
    else {
        res.status(404).json({
            message: "URL not found",
        });
    }
}));
// Delete URL by short code
router.delete("/:short_code", is_loggedin_1.isLoggedIn, (0, express_async_handler_1.default)(async (req, res) => {
    var _a;
    const { short_code } = req.params;
    const url = await models_1.Url.findOne({
        where: {
            short_code,
            user_id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
        },
    });
    if (url) {
        await url.destroy();
        res.status(200).json({
            message: "URL deleted successfully",
        });
    }
    else {
        res.status(404).json({
            message: "URL not found",
        });
    }
}));
// Update URL by short code
router.put("/:short_code", is_loggedin_1.isLoggedIn, (0, express_async_handler_1.default)(async (req, res) => {
    var _a;
    const { short_code } = req.params;
    const { long_url } = req.body;
    const url = await models_1.Url.findOne({
        where: {
            short_code,
            user_id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
        },
    });
    if (url) {
        url.long_url = long_url;
        await url.save();
        res.status(200).json({
            data: url,
            message: "URL updated successfully",
        });
    }
    else {
        res.status(404).json({
            message: "URL not found",
        });
    }
}));
// Get all URLs for a user
router.get("/", is_loggedin_1.isLoggedIn, (0, express_async_handler_1.default)(async (req, res) => {
    var _a;
    const urls = await models_1.Url.findAll({
        where: { user_id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
    });
    res.status(200).json({
        data: urls,
        message: "URLs fetched successfully",
    });
}));
// Get URL stats by short code
router.get("/stats/:short_code", is_loggedin_1.isLoggedIn, (0, express_async_handler_1.default)(async (req, res) => {
    const { short_code } = req.params;
    const url = await models_1.Url.findOne({ where: { short_code } });
    if (url) {
        res.status(200).json({
            data: {
                short_code: url.short_code,
                long_url: url.long_url,
                clicks: url.clicks,
                createdAt: url.createdAt,
                updatedAt: url.updatedAt,
            },
            message: "URL stats fetched successfully",
        });
    }
    else {
        res.status(404).json({
            message: "URL not found",
        });
    }
}));
exports.default = router;
