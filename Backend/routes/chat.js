import express from "express";
import Thread from "../models/Thread.js";
import getHuggingFaceResponse from "../utils/getHuggingFaceResponse.js";

const router = express.Router();

// Test route
router.post("/test", async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "xyz",
            title: "Testing New Thread2"
        });
        const response = await thread.save();
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to save in DB" });
    }
});

// GET all threads
router.get("/threads", async (req, res) => {
    try {
        const threads = await Thread.find().sort({ updatedAt: -1 });
        res.status(200).json(threads);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch threads" });
    }
});

// GET single thread by threadId
router.get("/threads/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
        const thread = await Thread.findOne({ threadId });
        if (!thread) return res.status(404).json({ error: "Thread not found" });
        res.status(200).json(thread);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch thread" });
    }
});

// DELETE thread by threadId
router.delete("/threads/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId });
        if (!deletedThread) return res.status(404).json({ error: "Thread not found" });
        res.status(200).json({ success: "Thread deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to delete thread" });
    }
});

// POST new message to a thread
router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;
    if (!threadId || !message) return res.status(400).json({ error: "Missing required fields" });

    try {
        let thread = await Thread.findOne({ threadId });

        if (!thread) {
            // Create a new thread if it doesn't exist
            thread = new Thread({
                threadId,
                title: message,
                messages: [{ role: "user", content: message }]
            });
        } else {
            thread.messages.push({ role: "user", content: message });
        }

        // Get assistant reply
        const assistantReply = await getHuggingFaceResponse(message);
        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();

        await thread.save();

        res.status(200).json({ reply: assistantReply, threadId: thread.threadId });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong" });
    }
});

export default router;

