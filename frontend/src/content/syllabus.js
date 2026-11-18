// Study content for each class. Subjects and topics are fixed school content.

export const subjectMeta = {
  English: { emoji: "🔤", tone: "blue" },
  Hindi: { emoji: "अ", tone: "orange" },
  Mathematics: { emoji: "🔢", tone: "green" },
  EVS: { emoji: "🌱", tone: "teal" },
  "General Knowledge": { emoji: "🌍", tone: "purple" },
  "Art & Craft": { emoji: "🎨", tone: "pink" },
};
export const allSubjects = Object.keys(subjectMeta);

export const syllabus = {
  Nursery: {
    English: ["Rhymes and sound recognition", "Picture reading", "Pre-writing strokes"],
    Hindi: ["स्वर पहचान", "चित्र देखकर बोलना", "आसान बाल कविताएँ"],
    Mathematics: ["Counting 1–10", "Big and small", "Basic shapes"],
    EVS: ["My family", "Colours around us", "Healthy habits"],
    "Art & Craft": ["Finger painting", "Paper tearing and pasting", "Clay play"],
  },
  LKG: {
    English: ["Alphabet recognition", "Phonics sounds", "Three-letter words"],
    Hindi: ["स्वर परिचय", "चित्र पहचान", "अ से अनार"],
    Mathematics: ["Numbers 1–30", "Comparison", "Patterns and shapes"],
    EVS: ["Plants and animals", "Community helpers", "Good habits"],
    "Art & Craft": ["Colouring within lines", "Paper folding", "Leaf printing"],
  },
  UKG: {
    English: ["Phonics and blends", "Sight words", "Simple sentences"],
    Hindi: ["व्यंजन परिचय", "दो अक्षर के शब्द", "सरल वाक्य"],
    Mathematics: ["Numbers 1–100", "Addition", "Subtraction", "Shapes"],
    EVS: ["Our body", "Seasons", "Transport"],
    "General Knowledge": ["India and symbols", "Amazing animals", "National festivals"],
    "Art & Craft": ["Drawing with shapes", "Origami basics", "Poster colours"],
  },
  "Class 1": {
    English: ["Reading fluency", "Grammar basics", "Creative writing"],
    Hindi: ["वाक्य रचना", "कहानी पठन", "मात्राएँ"],
    Mathematics: ["Place value", "Addition and subtraction", "Measurement"],
    EVS: ["Food and shelter", "Our neighbourhood", "Water and air"],
    "General Knowledge": ["Famous monuments", "Days and months", "Good manners"],
    "Art & Craft": ["Collage making", "Mask making", "Nature drawing"],
  },
  "Class 2": {
    English: ["Comprehension", "Parts of speech", "Writing paragraphs"],
    Hindi: ["व्याकरण", "अनुच्छेद लेखन", "संज्ञा और सर्वनाम"],
    Mathematics: ["Multiplication", "Division", "Time and money"],
    EVS: ["Our earth", "Safety and first aid", "Plants around us"],
    "General Knowledge": ["Our country", "Sports and games", "Inventions"],
    "Art & Craft": ["Craft with waste", "Landscape drawing", "Rangoli designs"],
  },
};

export const typeMeta = {
  Worksheet: { emoji: "📝", tone: "orange" },
  PDF: { emoji: "📄", tone: "pink" },
  Video: { emoji: "▶️", tone: "purple" },
  Image: { emoji: "🖼️", tone: "teal" },
};
