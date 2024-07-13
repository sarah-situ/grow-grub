# Grow-Grub🌱

Grow-Grub is your handy veggie-planting companion app. It helps to plan your garden by tracking where you've planted each veggie with your planting dates, and managing growth with scheduled watering and harvest times.

This is a group project that I worked on with six other team members. We had 7 days to build this full-stack web app.

 ## MVP Features
 - Add different garden plots to visualise and plan where to plant vegetables.
 - Search for different vegetables to plant, and add them to the database if not available from pre-existing list.
 - Watering schedule for planted vegetables and mark when you have watered.
 - Detailed plant care information, such as disease prevention, season to plant, and harvest.


### Installation

#### **From the command line**

```
git clone git@github.com:sarah-situ/Grow-Grub.git
cd grow-grub
npm install # to install dependencies
npm run knex migrate:latest
npm run knex seed:run
npm run dev # to start the dev server
```

You can find the server running on [http://localhost:3000](http://localhost:3000) and the client running on [http://localhost:5173](http://localhost:5173).

## Tech Used
- JavaScript
- TypeScript
- React.js
- Knex.js
- SQLite3
- Google Gemini API
- Auth0
- React Grid Layout Library
- Tailwind CSS

## Team Expectations
We created a team conflict resolution plan during our initial planning session to help us manage conflict before it arises and what steps we could take if it does come up.

### Feedbacks
- Use an ASK framework or consent before giving growth or appreciative feedback.

### Conflict
- Use Non-Violent Communication (NVC) if a conflict arises and communicate whether it is an observation, feeling, need, or request.

### Wellbeing
- Sharing stress profiles so we can look after our well-being and remind each other to take regular breaks.
- Wellbeing check-ins at standups and before pair programming.
- Normal lunch times but not enforced and spontaneous breaks at any time, but to be communicated if pair-programming.

### Communcation & Decision Making
- Have 2 daily stand-ups, one at 9 am and 4 pm.
- Establish that we will work during the normal 9-5 but no expectations outside these hours or over the weekend.
- Decision making to be within working hours and have big decisions as a team and decisions that aren't relevant to others can be made in smaller groups.
- Ensure consistent communication between team members on the discord channel about any merges or pull requests and changes on GitHub.
- Clear delineation and assignment of tickets.
- Check in with others after you have finished your ticket if they need help or if starting a new ticket.

## Planning
- Use of Figma to create wireframes.
- Created user stories to figure out what the target audience is.
  - Beginner: Little to no knowledge of planting veggies. Will require detailed plant care information and reminders when to water plants.
  - Intermediate: Proficient with basic gardening but needs more guidance on managing pest and disease prevention.
  - Advanced: Users who are familiar with gardening care but want an app that offers a planting schedule tailored to New Zealand climate and the ability to keep track of harvesting times.
