export const formatName = (user) => {
    const capitalizeWord = (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

    const names = [user.first_name, user.last_name].filter(Boolean);
    return names
        .map((name) => name.split(" ").map(capitalizeWord).join(" "))
        .join(" ");
};

// export default { formatName };