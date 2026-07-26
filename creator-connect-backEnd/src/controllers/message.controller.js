import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynHandler.js";

// ─── Send a message ───────────────────────────────────────────────────────────
const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, content } = req.body;

  if (!receiverId || !content?.trim()) {
    throw new ApiError(400, "receiverId and content are required");
  }

  // Prevent messaging yourself
  if (receiverId === req.user._id.toString()) {
    throw new ApiError(400, "You cannot message yourself");
  }

  const receiver = await User.findById(receiverId);
  if (!receiver) throw new ApiError(404, "Receiver not found");

  const message = await Message.create({
    sender: req.user._id,
    receiver: receiverId,
    content: content.trim(),
  });

  const populated = await message.populate([
    { path: "sender", select: "name avatar role" },
    { path: "receiver", select: "name avatar role" },
  ]);

  return res
    .status(201)
    .json(new ApiResponse(201, populated, "Message sent"));
});

// ─── Get conversation between two users ──────────────────────────────────────
const getConversation = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 50 } = req.query;

  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: userId },
      { sender: userId, receiver: req.user._id },
    ],
  })
    .populate("sender", "name avatar role")
    .populate("receiver", "name avatar role")
    .sort({ createdAt: 1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  // Mark all incoming messages as read
  await Message.updateMany(
    { sender: userId, receiver: req.user._id, isRead: false },
    { isRead: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, messages, "Conversation fetched"));
});

// ─── Get all conversations (contact list) ────────────────────────────────────
const getContacts = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get distinct users the current user has exchanged messages with
  const sent = await Message.distinct("receiver", { sender: userId });
  const received = await Message.distinct("sender", { receiver: userId });

  // Merge and deduplicate contact IDs
  const contactIds = [...new Set([...sent.map(String), ...received.map(String)])];

  // For each contact, get the latest message and unread count
  const contacts = await Promise.all(
    contactIds.map(async (contactId) => {
      const [latestMessage, unreadCount, user] = await Promise.all([
        Message.findOne({
          $or: [
            { sender: userId, receiver: contactId },
            { sender: contactId, receiver: userId },
          ],
        })
          .sort({ createdAt: -1 })
          .select("content createdAt sender"),
        Message.countDocuments({
          sender: contactId,
          receiver: userId,
          isRead: false,
        }),
        User.findById(contactId).select("name avatar role"),
      ]);

      return {
        user,
        lastMessage: latestMessage?.content || "",
        lastMessageTime: latestMessage?.createdAt,
        unread: unreadCount,
      };
    })
  );

  // Sort contacts by last message time (most recent first)
  contacts.sort(
    (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
  );

  return res
    .status(200)
    .json(new ApiResponse(200, contacts, "Contacts fetched"));
});

// ─── Delete a message ─────────────────────────────────────────────────────────
const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  const message = await Message.findById(messageId);
  if (!message) throw new ApiError(404, "Message not found");

  if (message.sender.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own messages");
  }

  await message.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Message deleted"));
});

export { sendMessage, getConversation, getContacts, deleteMessage };
