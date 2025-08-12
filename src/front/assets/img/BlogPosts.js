export default [
  {
    id: crypto.randomUUID(),
    title: "The First Post",
    date:"33/05/25",
    image: "https://picsum.photos/id/1018/600/400",
    body: [
      "This is the first line of the post.",
      "This is the second line."
    ],
    createdOn: new Date("2023-08-30T12:00:00Z").toISOString(),
    likes: 2,
    comments: [
      { 
        id: crypto.randomUUID(),
        author: "Alice", 
        body: "Great post!", 
        createdOn: new Date("2023-08-30T15:16:40Z").toISOString() 
      },
      { 
        id: crypto.randomUUID(),
        author: "Bob", 
        body: "I learned a lot.", 
        createdOn: new Date("2023-08-30T15:33:20Z").toISOString() 
      }
    ]
  },
  {
    id: crypto.randomUUID(),
    title: "Another Day, Another Post",
    date:"33/05/25",
    image: "https://picsum.photos/id/1025/600/400",
    body: ["Exploring more content here."],
    createdOn: new Date("2023-08-31T09:26:40Z").toISOString(),
    likes: 1,
    comments: []
  },
  {
    id: crypto.randomUUID(),
    title: "Sunset Adventures",
    date:"33/05/25",
    image: "https://picsum.photos/id/1035/600/400",
    body: [
      "Capturing the beauty of the evening sky.",
      "Nature never disappoints."
    ],
    createdOn: new Date("2023-08-31T14:40:00Z").toISOString(),
    likes: 4,
    comments: [
      { 
        id: crypto.randomUUID(),
        author: "Clara", 
        body: "Breathtaking!", 
        createdOn: new Date("2023-08-31T15:30:00Z").toISOString() 
      }
    ]
  },
  {
    id: crypto.randomUUID(),
    title: "City Lights",
    date:"33/05/25",
    image: "https://picsum.photos/id/1043/600/400",
    body: ["Exploring the vibrant nightlife of the city."],
    createdOn: new Date("2023-09-01T03:33:20Z").toISOString(),
    likes: 3,
    comments: []
  },
  {
    id: crypto.randomUUID(),
    title: "Mountain Escape",
    image: "https://picsum.photos/id/1056/600/400",
    body: [
      "A peaceful retreat into the mountains.",
      "Fresh air and quiet trails."
    ],
    createdOn: new Date("2023-09-01T22:26:40Z").toISOString(),
    likes: 5,
    comments: [
      { 
        id: crypto.randomUUID(),
        author: "Dylan", 
        body: "Looks so calm!", 
        createdOn: new Date("2023-09-01T23:50:00Z").toISOString() 
      }
    ]
  },
  {
    id: crypto.randomUUID(),
    title: "Ocean Vibes",
    date:"33/05/25",
    image: "https://picsum.photos/id/1069/600/400",
    body: [
      "Nothing beats a day by the ocean.",
      "Waves, sand, and sunshine."
    ],
    createdOn: new Date("2023-09-02T18:20:00Z").toISOString(),
    likes: 6,
    comments: [
      { 
        id: crypto.randomUUID(),
        author: "Ella", 
        body: "I can almost feel the breeze!", 
        createdOn: new Date("2023-09-02T19:43:20Z").toISOString() 
      }
    ]
  }
];