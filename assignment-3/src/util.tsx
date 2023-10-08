export const createUniqueId = () => {
    const timestamp = Date.now().toString(36); // Convert current timestamp to base36 string
    const randomNum = Math.random().toString(36).substr(2, 5); // Generate a random base36 string
    return timestamp + randomNum;
};
