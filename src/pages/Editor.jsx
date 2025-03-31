import { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaHeading,
  FaListOl,
  FaListUl,
  FaQuoteRight,
  FaLink,
  FaImage,
  FaTable,
  FaUndo,
  FaRedo,
  FaFilePdf,
  FaFileAlt,
  FaSun,
  FaMoon,
  FaMagic,
  FaSave,
} from 'react-icons/fa';
import { jsPDF } from 'jspdf';
// import './editor-styles.css'; // Create this file


// Or add these styles directly in your component
<style>{`
  .ProseMirror ul, 
  .ProseMirror ol {
    padding: 0 1rem;
    margin: 1rem 0;
  }

  .ProseMirror ul {
    list-style-type: disc;
  }

  .ProseMirror ol {
    list-style-type: decimal;
  }

  .ProseMirror li {
    margin: 0.5rem 0;
  }
`}</style>

const TextEditor = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [title, setTitle] = useState('Untitled Document');
  const [lastSaved, setLastSaved] = useState(null);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('editorDarkMode', !darkMode);
  };

  // Initialize editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      Link.configure({
        openOnClick: false,
      }),
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: 'Start writing here...',
      }),
      CharacterCount.configure({
        limit: 100000,
      }),
    ],
    content: localStorage.getItem('editorContent') || '<p>Start writing here...</p>',
    onUpdate: ({ editor }) => {
      localStorage.setItem('editorContent', editor.getHTML());
      setLastSaved(new Date().toLocaleTimeString());
    },
  });

  // Autosave effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (editor) {
        localStorage.setItem('editorContent', editor.getHTML());
        setLastSaved(new Date().toLocaleTimeString());
      }
    }, 30000); // Autosave every 30 seconds

    return () => clearInterval(interval);
  }, [editor]);

  // Load dark mode preference
  useEffect(() => {
    const savedMode = localStorage.getItem('editorDarkMode');
    if (savedMode) {
      setDarkMode(savedMode === 'true');
    }
  }, []);

  // Set image URL
  const addImage = useCallback(() => {
    const url = window.prompt('Enter the URL of the image:');

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  // Set link
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  // Export to PDF
  const exportToPDF = () => {
    if (!editor) return;
    
    const doc = new jsPDF();
    const content = editor.getText();
    doc.text(content, 10, 10);
    doc.save(`${title}.pdf`);
  };


  // AI writing assistant (mock implementation)
  const analyzeContent = () => {
    if (!editor) return;
    
    setAiAssistantOpen(true);
    // In a real implementation, you would call an API here
    const mockSuggestions = [
      {
        id: 1,
        text: 'Consider shortening this sentence for better readability.',
        position: 45,
        type: 'readability',
      },
      {
        id: 2,
        text: 'Possible grammar error: "their" vs "there"',
        position: 120,
        type: 'grammar',
      },
      {
        id: 3,
        text: 'This paragraph could be more concise.',
        position: 210,
        type: 'style',
      },
    ];
    setAiSuggestions(mockSuggestions);
  };

  if (!editor) {
    return null;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <style/>
      <header className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`text-xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-300'} rounded px-2 py-1 w-full max-w-md`}
          />
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {lastSaved ? `Last saved: ${lastSaved}` : 'Not saved yet'}
            </div>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className={`sticky top-16 z-10 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="container mx-auto px-4 py-2 flex flex-wrap items-center gap-2 overflow-x-auto">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded ${editor.isActive('bold') ? (darkMode ? 'bg-blue-600' : 'bg-blue-100') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
            title="Bold"
          >
            <FaBold />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded ${editor.isActive('italic') ? (darkMode ? 'bg-blue-600' : 'bg-blue-100') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
            title="Italic"
          >
            <FaItalic />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded ${editor.isActive('underline') ? (darkMode ? 'bg-blue-600' : 'bg-blue-100') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
            title="Underline"
          >
            <FaUnderline />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded ${editor.isActive('strike') ? (darkMode ? 'bg-blue-600' : 'bg-blue-100') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
            title="Strikethrough"
          >
            <FaStrikethrough />
          </button>

          <div className="h-6 border-l mx-1" />

          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded ${editor.isActive('heading', { level: 1 }) ? (darkMode ? 'bg-blue-600' : 'bg-blue-100') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
            title="Heading 1"
          >
            <span className="flex items-center">
              <FaHeading className="mr-1" />1
            </span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? (darkMode ? 'bg-blue-600' : 'bg-blue-100') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
            title="Heading 2"
          >
            <span className="flex items-center">
              <FaHeading className="mr-1" />2
            </span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded ${editor.isActive('heading', { level: 3 }) ? (darkMode ? 'bg-blue-600' : 'bg-blue-100') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
            title="Heading 3"
          >
            <span className="flex items-center">
              <FaHeading className="mr-1" />3
            </span>
          </button>

          <div className="h-6 border-l mx-1" />

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded ${editor.isActive('bulletList') ? (darkMode ? 'bg-blue-600' : 'bg-blue-100') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
            title="Bullet List"
          >
            <FaListUl />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded ${editor.isActive('orderedList') ? (darkMode ? 'bg-blue-600' : 'bg-blue-100') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
            title="Numbered List"
          >
            <FaListOl />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded ${editor.isActive('blockquote') ? (darkMode ? 'bg-blue-600' : 'bg-blue-100') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
            title="Blockquote"
          >
            <FaQuoteRight />
          </button>

          <div className="h-6 border-l mx-1" />

          <button
            onClick={setLink}
            className={`p-2 rounded ${editor.isActive('link') ? (darkMode ? 'bg-blue-600' : 'bg-blue-100') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
            title="Link"
          >
            <FaLink />
          </button>
          <button
            onClick={addImage}
            className={`p-2 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            title="Image"
          >
            <FaImage />
          </button>
          <button
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            className={`p-2 rounded ${editor.isActive('table') ? (darkMode ? 'bg-blue-600' : 'bg-blue-100') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
            title="Table"
          >
            <FaTable />
          </button>

          <div className="h-6 border-l mx-1" />

          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className={`p-2 rounded ${!editor.can().undo() ? (darkMode ? 'text-gray-500' : 'text-gray-300') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
            title="Undo"
          >
            <FaUndo />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className={`p-2 rounded ${!editor.can().redo() ? (darkMode ? 'text-gray-500' : 'text-gray-300') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
            title="Redo"
          >
            <FaRedo />
          </button>

          <div className="h-6 border-l mx-1" />

          <button
            onClick={analyzeContent}
            className={`p-2 rounded ${aiAssistantOpen ? (darkMode ? 'bg-purple-600' : 'bg-purple-100') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
            title="AI Writing Assistant"
          >
            <FaMagic />
          </button>

          <div className="h-6 border-l mx-1" />

          <button
            onClick={exportToPDF}
            className={`p-2 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            title="Export to PDF"
          >
            <FaFilePdf />
          </button>
          
         
        </div>
      </div>

      {/* Editor Content */}
      <div className="container mx-auto px-4 py-6">
        <div className={`relative ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          {editor && (
            <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
              <div className={`flex items-center gap-1 p-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} shadow-lg`}>
                <button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-1 rounded ${editor.isActive('bold') ? (darkMode ? 'bg-blue-600' : 'bg-blue-100') : ''}`}
                >
                  <FaBold />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-1 rounded ${editor.isActive('italic') ? (darkMode ? 'bg-blue-600' : 'bg-blue-100') : ''}`}
                >
                  <FaItalic />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className={`p-1 rounded ${editor.isActive('underline') ? (darkMode ? 'bg-blue-600' : 'bg-blue-100') : ''}`}
                >
                  <FaUnderline />
                </button>
                <button
                  onClick={setLink}
                  className={`p-1 rounded ${editor.isActive('link') ? (darkMode ? 'bg-blue-600' : 'bg-blue-100') : ''}`}
                >
                  <FaLink />
                </button>
              </div>
            </BubbleMenu>
          )}
          
          <EditorContent
            editor={editor}
            className={`min-h-[calc(100vh-250px)] p-6 focus:outline-none ${darkMode ? 'prose-dark' : 'prose'} prose max-w-none`}
          />
        </div>

        <div className={`mt-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {editor?.storage.characterCount.characters()} characters | {editor?.storage.characterCount.words()} words
        </div>
      </div>

      {/* AI Assistant Panel */}
      {aiAssistantOpen && (
        <div className={`fixed bottom-0 left-0 right-0 z-20 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}>
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">AI Writing Assistant</h3>
              <button
                onClick={() => setAiAssistantOpen(false)}
                className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                ×
              </button>
            </div>
            
            {aiSuggestions.length > 0 ? (
              <div className="space-y-2">
                {aiSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                  >
                    <div className="flex items-start">
                      <div className={`w-2 h-2 mt-1.5 rounded-full mr-2 ${
                        suggestion.type === 'grammar' ? 'bg-red-500' :
                        suggestion.type === 'readability' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`} />
                      <div>
                        <p>{suggestion.text}</p>
                        <button
                          onClick={() => {
                            // In a real implementation, you would navigate to the position
                            // and potentially apply the suggestion
                            editor.commands.focus();
                          }}
                          className={`text-sm mt-1 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                        >
                          Show in text
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p>No suggestions found. Your content looks good!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextEditor;