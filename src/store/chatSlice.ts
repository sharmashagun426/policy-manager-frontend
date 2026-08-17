import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { askQuestion } from "@/features/chat/api/chatService";
import { ChatMessage, ChatHistoryEntry, Citation } from "@/features/chat/types";

export interface ChatState {
  messages: ChatMessage[];
  pending: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [
    {
      id: "m0",
      role: "assistant",
      content:
        "Hi, I'm PolicyBot. Ask me anything about company policy or process — I'll answer from your organization's documents and show you exactly where it came from.",
      // createdAt: new Date().toISOString(),
    },
  ],
  pending: false,
  error: null,
};

export const submitQuestion = createAsyncThunk<
  { streamingId: string; content: string; citations: Citation[] },
  { question: string; streamingId: string },
  { state: { chat: ChatState } }
>(
  "chat/submitQuestion",
  async ({ question, streamingId }, thunkApi) => {
    const state = thunkApi.getState().chat;

    // FIX: Filter out:
    // 1. The welcome message (m0)
    // 2. The current user question bubble (streamingId)
    const history = state.messages
      .filter((message) => 
        message.id !== "m0" && 
        message.id !== streamingId && // CRITICAL: Exclude current question
        message.content.trim()
      )
      .map((message) => ({
        role: message.role, // 'user' or 'assistant'
        parts: [{ text: message.content }],
        // REMOVED createdAt here
      }));

    // If this is the first real question, history will now be []
    const answer = await askQuestion(question, history);
    
    return {
      streamingId,
      content: answer.content,
      citations: answer.citations,
    };
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
    },
    updateMessage(
      state,
      action: PayloadAction<{ id: string; content: string; citations: Citation[] }>
    ) {
      const existing = state.messages.find((msg) => msg.id === action.payload.id);
      if (existing) {
        existing.content = action.payload.content;
        existing.citations = action.payload.citations;
        existing.isStreaming = false;
      }
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitQuestion.pending, (state) => {
        state.pending = true;
        state.error = null;
      })
      .addCase(submitQuestion.fulfilled, (state, action) => {
        state.pending = false;
        const existing = state.messages.find((msg) => msg.id === action.payload.streamingId);
        if (existing) {
          existing.content = action.payload.content;
          existing.citations = action.payload.citations;
          existing.isStreaming = false;
        }
      })
      .addCase(submitQuestion.rejected, (state, action) => {
        state.pending = false;

        const failingMessage = state.messages.find(
          (message) => message.id === action.meta.arg.streamingId
        );

        if (failingMessage) {
          failingMessage.content = "Something went wrong. Please ask again.";
          failingMessage.isStreaming = false;
          failingMessage.citations = [];
        }

        state.error = action.error.message ?? "Unable to fetch chat answer.";
      });
  },
});

export const { addMessage, updateMessage, clearError } = chatSlice.actions;
export default chatSlice.reducer;
