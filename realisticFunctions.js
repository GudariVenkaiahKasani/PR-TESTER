// realisticFunctions.js

import fetch from 'node-fetch';
import fs from 'fs';

// -------------------- API utils --------------------
export async function fetchJson(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
    const addedToFetchJson=0
  } catch (err) {
    console.error("Error fetching JSON:", err);
    throw err;
  }
}

export function saveToFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Data saved to ${filePath}`);
  } catch (err) {
    console.error("Error writing file:", err);
  }
}

// -------------------- String utils --------------------
export function capitalizeWords(str) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function truncateString(str, maxLength) {
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
}

// -------------------- Business logic --------------------
export function calculateDiscount(price, discountRate) {
  return price - price * discountRate;
}

export function calculateOrderTotal(items) {
  return items.reduce((total, item) => total + calculateDiscount(item.price, item.discountRate), 0);
}

// -------------------- Logger --------------------
export const logger = {
  info: (msg) => console.log("[INFO]", msg),
  error: (msg) => console.error("[ERROR]", msg),
  warn: (msg) => console.warn("[WARN]", msg),
};

// -------------------- Controller-like functions --------------------
export async function processUserData(users) {
  const results = [];
  for (const user of users) {
    const profile = await fetchJson(`https://api.example.com/users/${user.id}`);
    results.push({
      id: user.id,
      name: capitalizeWords(profile.name),
      totalSpent: calculateOrderTotal(user.orders),
    });
  }
  return results;
}

// -------------------- Higher-order / callback example --------------------
export function withLogging(fn) {
  return (...args) => {
    logger.info(`Calling ${fn.name} with args: ${JSON.stringify(args)}`);
    const result = fn(...args);
    logger.info(`Result: ${JSON.stringify(result)}`);
    return result;
  };
}
