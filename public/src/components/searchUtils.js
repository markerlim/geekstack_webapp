// searchUtils.js
const searchMatch = (document, currentSearchQuery) => {
    const searchQuery = currentSearchQuery.toLowerCase();

    // Check if searchQuery is empty
    if (searchQuery === "") return true;

    // Check if cardname matches searchQuery
    if (document.cardName && document.cardName.toLowerCase().includes(searchQuery)) {
        return true;
    }

    // Check if booster matches searchQuery
    if (document.booster && document.booster.toLowerCase().includes(searchQuery)) {
        return true;
    }

    // Check if category matches searchQuery
    if (document.category && document.category.toLowerCase().includes(searchQuery)) {
        return true;
    }

    // Check if card id matches searchQuery
    if (document.cardId && document.cardId.toLowerCase().includes(searchQuery)) {
        return true;
    }

    // Check if BP matches searchQuery
    if (document.basicpower && document.basicpower.toLowerCase().includes(searchQuery)) {
        return true;
    }

    // Check if triggerState matches searchQuery
    if (document.triggerState && document.triggerState.toLowerCase().includes(searchQuery)) {
        return true;
    }

    return false;
};

export default searchMatch;

