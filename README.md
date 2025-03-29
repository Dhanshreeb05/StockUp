# Stock Trading and Portfolio Management Application

## Overview

This application is a stock trading and portfolio management system, providing a comprehensive platform for users to manage their stock investments. It includes functionalities for user management, share trading, portfolio management, and accessing real-time stock market news.

## Features

1. User Registration, Login, and Management
2. Bank Account Management
3. Buy and Sell Shares
4. Portfolio Management
5. Watchlist Management
6. Transaction History
7. Real-Time Share Value Updates
8. News Fetching from External API

## Tech Stack

Frontend: Angular, TypeScript
Backend: Node.js, Express.js
Database: MySQL
API Integration: Marketaux API
Others: CORS, Body Parser

## Prerequisites

Ensure you have the following installed:
Node.js
MySQL Server
npm

# API Endpoints

## User Management

1. POST /api/user/signup: Register a new user
2. POST /api/user/login: Login user
3. POST /api/user/logout: Logout user
4. POST /api/user/updateUser: Update user details
5. POST /api/user/deleteUser: Delete a user
6. POST /api/user/addBankAccount: Add a bank account
7. POST /api/user/getBalance: Get user balance

## Share Management

1. POST /api/shares/buys: Buy shares
2. POST /api/shares/sells: Sell shares
3. POST /api/shares/getPortfolio: Get user portfolio
4. POST /api/shares/getTransactionsTable: Get user transactions
5. POST /api/shares/getMostProfitable: Get most profitable shares
6. POST /api/shares/calculatePortfolioProfit: Calculate portfolio profit
7. POST /api/shares/calculateRealisedProfit: Calculate realized profit
8. POST /api/shares/getAllOrders: Get all orders
9. POST /api/shares/cancelOrder: Cancel an order

## Watchlist Management

1. POST /api/shares/addToWatchlist: Add a stock to the watchlist
2. POST /api/shares/deleteStockFromWatchList: Delete a stock from the watchlist
3. POST /api/shares/getWatchList: Get user watchlist

## Market Data

1. GET /api/shares/getAllShares: Get all shares data
2. GET /api/shares/updateShareValue: Update share values every 2 minutes
3. POST /api/shares/getShareChartData: Get share chart data
4. POST /api/getNews: Fetch latest stock market news
5. POST /api/shares/getNewsletters: Get personalized newsletters
