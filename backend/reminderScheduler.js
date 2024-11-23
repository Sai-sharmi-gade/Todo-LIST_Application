const cron = require('node-cron');
const Task = require('./models/Task');

const { sendReminder } = require('./server');

// Schedule the task reminder
const scheduleTaskReminder = (task) => {
  cron.schedule(task.reminderTime, () => {
    console.log(`Reminder for task: ${task.name}`);
    sendReminder(task); // Send the task reminder to all connected clients
  });
};




// Scheduler to check every minute
cron.schedule('* * * * *', async () => {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const currentTime = now.toTimeString().split(' ')[0].substring(0, 5); // Format: HH:MM

    try {
        // Find tasks whose date and time match current date and time
        const tasks = await Task.find({ date: currentDate, time: currentTime, completed: false });
        if (tasks.length > 0) {
            tasks.forEach(task => {
                // You can send notifications to the user here
                console.log(`Reminder: Time to do the task "${task.name}"`);
            });
        }
    } catch (error) {
        console.error('Error fetching tasks for reminders:', error);
    }
});
