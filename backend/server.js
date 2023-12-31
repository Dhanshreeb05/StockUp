const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const server = express();
const config = require("./config");
server.use(bodyParser.json());
var cors = require("cors");

//Establish the database connection
server.use(cors());
const db = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
});

db.connect(function (error) {
  console.log(error);
  if (error) {
    console.log("Error Connecting to DB");
  } else {
    console.log("Successfully Connected to DB");
  }
});

//Establish the Port

server.listen(8085, function check(error) {
  if (error) {
    console.log("Error while starting the server");
  } else {
    console.log("Server is running on port 8085");
  }
});

// handling CORS
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// ACTUAL PROJECT

//add new user
server.post("/api/user/signup", (req, res) => {
  let signUpoObj = {
    username: req.body.user_email,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    street_name: req.body.street_name,
    town: req.body.town,
    street_no: req.body.street_no,
    zipcode: req.body.zipcode,
    user_password: req.body.user_password,
  };
  let sql = "CALL add_user_if_not_exists(?,?,?,?,?,?,?,?)";
  db.query(
    sql,
    [
      signUpoObj.username,
      signUpoObj.user_password,
      signUpoObj.first_name,
      signUpoObj.last_name,
      signUpoObj.street_name,
      signUpoObj.town,
      signUpoObj.street_no,
      signUpoObj.zipcode,
    ],
    (error, result) => {
      if (error) {
        res.send({ status: false, message: error });
      } else {
        console.log(result);
        res.send({ status: true, message: "User created successfully" });
      }
    }
  );
});

//check login user
server.post("/api/user/login", (req, res) => {
  console.log(req.body);
  let details = {
    useremail: req.body.email,
    password: req.body.password,
  };

  let sql = "SELECT * FROM users WHERE user_email = ? AND user_password = ?";
  let values = [details.useremail, details.password];
  db.query(sql, values, (error, result) => {
    if (result === undefined) {
      res.send({ status: false, message: "User does not exists " });
    } else if (result.length === 0) {
      res.send({ status: false, message: "User does not exists " });
    } else {
      console.log(result);
      let user = result[0];
      if (error) {
        res.send({ status: false, message: "User login Failed", user });
      } else {
        res.send({ status: true, message: "User login successfully", user });
      }
    }
  });
});

//delete user
server.post("/api/user/deleteUser", (req, res) => {
  console.log(req.body);
  let sql = "CALL delete_user_if_exists(?)";
  let values = [req.body.user_id];
  db.query(sql, values, (error, result) => {
    if (error) {
      console.log(error);
      res.send({ status: false, message: "User delete Failed" });
    } else {
      console.log("hit");
      res.send({ status: true, message: "User delete successfully" });
    }
  });
});

//update user

server.post("/api/user/updateUser", (req, res) => {
  let details = {
    user_id: req.body.user_id,
    username: req.body.user_email,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    street_name: req.body.street_name,
    town: req.body.town,
    street_no: req.body.street_no,
    zipcode: req.body.zipcode,
    user_password: req.body.user_password,
  };

  let sql = "CALL update_user_if_exists(?,?,?,?,?,?,?,?,?)";
  let values = [
    details.user_id,
    details.username,
    details.user_password,
    details.first_name,
    details.last_name,
    details.street_name,
    details.town,
    details.street_no,
    details.zipcode,
  ];
  console.log(values);
  db.query(sql, values, (error, result) => {
    if (error) {
      console.log(error);
      res.send({ status: false, message: "User update Failed" });
    } else {
      console.log(result);
      console.log("hit");
      res.send({ status: true, message: "User update successfully" });
    }
  });
});

// add user bank account details
server.post("/api/user/addBankAccount", (req, res) => {
  console.log(req.body);
  let details = {
    p_account_id: req.body.p_account_id,
    p_bank_name: req.body.p_bank_name,
    p_routing_number: req.body.p_routing_number,
    p_user_id: req.body.p_user_id,
  };
  console.log(details);
  let sql = "CALL insert_account_if_not_exists(?,?,?,?)";
  let values = [
    details.p_account_id,
    details.p_bank_name,
    details.p_routing_number,
    details.p_user_id,
  ];
  db.query(sql, values, (error, result) => {
    if (error) {
      console.log(error);
      res.send({ status: false, message: "Bank account add Failed" });
    } else {
      console.log(result);
      console.log("hit");
      res.send({ status: true, message: "Bank account add successfully" });
    }
  });
});

//buy shares
server.post("/api/shares/buys", (req, res) => {
  console.log(req.body);
  let details = {
    p_user_id: req.body.user_id,
    p_share_symbol: req.body.share_symbol,
    p_transaction_type: req.body.transaction_type,
    p_buy_rate: req.body.buy_rate,
    p_quantity: req.body.quantity,
  };
  let sql = "CALL place_buy_order(?,?,?,?,?)";
  let values = [
    details.p_user_id,
    details.p_share_symbol,
    details.p_transaction_type,
    details.p_buy_rate,
    details.p_quantity,
  ];
  db.query(sql, values, (error, result) => {
    if (error) {
      if (error.sqlState === "23000") {
        res.send({ status: false, message: "Insufficient Balance" });
      } else {
        res.send({ status: false, message: "Shares buy Failed" });
      }
    } else {
      console.log(result, "success");
      res.send({ status: true, message: "Shares buy successfully" });
    }
  });
});

//sell shares
server.post("/api/shares/sells", (req, res) => {
  console.log(req.body);
  let details = {
    p_user_id: req.body.user_id,
    p_share_symbol: req.body.share_symbol,
    p_transaction_type: req.body.transaction_type,
    p_sell_rate: req.body.sell_rate,
    p_quantity: req.body.quantity,
  };
  let sql = "CALL place_sell_order(?,?,?,?,?)";
  let values = [
    details.p_user_id,
    details.p_share_symbol,
    details.p_transaction_type,
    details.p_sell_rate,
    details.p_quantity,
  ];
  db.query(sql, values, (error, result) => {
    if (error) {
      res.send({ status: false, message: error.message });
    } else {
      res.send({ status: true, message: "Shares sell successfully" });
    }
  });
});

//logout user
server.post("/api/user/logout", (req, res) => {
  let details = {
    useremail: req.body.email,
    password: req.body.password,
  };

  let sql =
    "SELECT * FROM users WHERE useremail='" +
    req.body.email +
    "' AND password='" +
    req.body.password +
    "'";
  db.query(sql, (error, result) => {
    if (error) {
      res.send({ status: false, message: "User logout Failed" });
    } else {
      res.send({ status: true, message: "User logout successfully" });
    }
  });
});

// get portfolio of user
server.post("/api/shares/getPortfolio", (req, res) => {
  console.log(req.body);
  let details = {
    user_id: req.body.p_user_id,
  };
  let sql = "CALL get_user_portfolio(?)";
  let values = [details.user_id];
  db.query(sql, values, (error, result) => {
    if (error) {
      console.log(error);
      res.send({
        status: false,
        message: "Could not fetch Data for Portfolio",
      });
    } else {
      console.log(result);
      let portfolio = result;
      res.send({
        status: true,
        message: "Data retriverd successfully  ",
        portfolio,
      });
    }
  });
});

// get all shares data
server.get("/api/shares/getAllShares", (req, res) => {
  var sql = "SELECT * FROM shares_data";
  db.query(sql, function (error, result) {
    if (result.length === 0) {
      res.send({ status: false, message: "No shares data found" });
    } else {
      let shares = result;
      if (error) {
        console.log("Error Connecting to DB");
      } else {
        console.log(res);
        console.log(shares);
        res.send({ status: true, message: "Shares data updated ", shares });
      }
    }
  });
});

// get watchlist of user

server.post("/api/shares/getWatchList", (req, res) => {
  console.log(req.body);
  let details = {
    user_id: req.body.p_user_id,
    watchlist_name: req.body.p_watchlist_name,
  };
  let values = [details.user_id, details.watchlist_name];
  let sql = "CALL get_watchlist_data(?,?)";
  db.query(sql, values, (error, result) => {
    if (error) {
      res.send({
        status: false,
        message: "Could not fetch Data for Watchlist",
      });
    } else {
      console.log(result);
      let watchlist = result;
      res.send({
        status: true,
        message: "Data retriverd successfully  ",
        watchlist,
      });
    }
  });
});

// add share to watchlist
server.post("/api/shares/addToWatchlist", (req, res) => {
  console.log(req.body);
  let details = {
    p_user_id: req.body.user_id,
    p_share_symbol: req.body.share_symbol,
    p_watchlist_name: req.body.watchlist_name,
  };

  let sql = "CALL add_share_to_watchlist(?,?,?)";
  db.query(
    sql,
    [details.p_user_id, details.p_share_symbol, details.p_watchlist_name],
    (error, result) => {
      if (error) {
        console.log(error);
        res.send({ status: false, message: "Stock could not be added" });
      } else {
        console.log(result);
        res.send({ status: true, message: "Stock added successfully" });
      }
    }
  );
});

// delete share from watchlist
server.post("/api/shares/deleteStockFromWatchList", (req, res) => {
  let details = {
    p_user_id: req.body.user_id,
    p_share_symbol: req.body.share_symbol,
    p_watchlist_name: req.body.watchlist_name,
  };
  db.query(
    "CALL delete_share_from_watchlist(?,?,?)",
    [details.p_user_id, details.p_share_symbol, details.p_watchlist_name],
    (error, result) => {
      if (error) {
        console.log(error);
        res.send({ status: false, message: "Stock could not be deleted" });
      } else {
        console.log(result);
        res.send({ status: true, message: "Stock deleted successfully" });
      }
    }
  );
});

// get user transactions
server.post("/api/shares/getTransactionsTable", (req, res) => {
  console.log(req.body);
  let details = {
    user_id: req.body.p_user_id,
  };
  let sql = "CALL get_user_transaction(?)";
  let values = [details.user_id];
  db.query(sql, values, (error, result) => {
    if (error) {
      console.log(error);
      res.send({
        status: false,
        message: "Could not fetch Data for Transactions",
      });
    } else {
      console.log(result);
      let transactions = result;
      res.send({
        status: true,
        message: "Data retriverd successfully  ",
        transactions,
      });
    }
  });
});

// get most profitable shares
server.post("/api/shares/getMostProfitable", (req, res) => {
  let sql = "CALL find_most_profitable_share(?)";
  db.query(sql, req.body.p_user_id, (error, result) => {
    if (error) {
      console.log(error);
      res.send({
        status: false,
        message: "Could not fetch Data for Most Profitable",
      });
    } else {
      console.log(result);
      let mostProfitable = result;
      res.send({
        status: true,
        message: "Data retriverd successfully  ",
        mostProfitable,
      });
    }
  });
});

// get calculate_portfolio_profit
server.post("/api/shares/calculatePortfolioProfit", (req, res) => {
  let sql = "SELECT calculate_portfolio_profit(?)";
  db.query(sql, req.body.p_user_id, (error, result) => {
    if (error) {
      console.log(error);
      res.send({
        status: false,
        message: "Could not fetch Data for Portfolio Profit",
      });
    } else {
      let portfolioProfit = result;
      res.send({
        status: true,
        message: "Data retriverd successfully  ",
        portfolioProfit,
      });
    }
  });
});

//calculate_realised_profit
server.post("/api/shares/calculateRealisedProfit", (req, res) => {
  let sql = "SELECT calculate_realised_profit(?)";
  db.query(sql, req.body.p_user_id, (error, result) => {
    if (error) {
      console.log(error, "hit3");
      res.send({
        status: false,
        message: "Could not fetch Data for Realised Profit",
      });
    } else {
      console.log(result);
      let realisedProfit = result;
      res.send({
        status: true,
        message: "Data retriverd successfully  ",
        realisedProfit,
      });
    }
  });
});

//get all orders placed
server.post("/api/shares/getAllOrders", (req, res) => {
  let sql = "select * from orders where user_id = ?";
  db.query(sql, req.body.p_user_id, (error, result) => {
    if (error) {
      console.log(error);
      res.send({ status: false, message: "Could not fetch Data for Orders" });
    } else {
      console.log(result);
      let orders = result;
      res.send({
        status: true,
        message: "Data retriverd successfully  ",
        orders,
      });
    }
  });
});


// get news from api
server.post("/api/getNews", () => {
  let shares_query = "SELECT GROUP_CONCAT(DISTINCT share_symbol) as res FROM shares_data;";
  db.query(shares_query,(error, result) => {
    if (error) {
      console.log(error);
      console.log("Could not fetch_shares");
    } else {
      console.log(result);
      let shares = result[0].res;
      console.log("shares_fetched_successfully  ");

      const apiURL = "https://api.marketaux.com/v1/news/all?symbols=AMZN&filter_entities=true&language=en&api_token=PS03cbwOep4rlvXwcVWygXZ8LjE9NABa4RQULG5H";
// Fetch data from the API
      fetch(apiURL)
          .then(response => response.json())
          .then(data => {
            // Handle the JSON data here
            //console.log(data);
            let news = data;
            //console.log("DATA",news.data);
            //console.log("DATA 1",news.data[1].entities[1].symbol);
            console.log(apiURL);
            console.log(news)
            const sql = 'INSERT INTO news_data (uuid, title, news_description, news_url, image_url, share_symbol) VALUES ?';
            const values = news.data.map(item => [
              item.uuid,
              item.title,
              item.description,
              item.url,
              item.image_url,
              item.entities[0].symbol// Assuming the share symbol is in the first entity
            ]);
            db.query(sql, [values],(error, result) => {
              if (error) {
                console.log(error);
                console.log("Could not add news" );
              } else {
                console.log(result);
                console.log("News added successfully");
              }
            });
          })
          .catch(error => {
            // Handle errors during the fetch
            console.error("Error fetching data:", error);
          });
    }
  });

});




//cancel order
server.post("/api/shares/cancelOrder", (req, res) => {
  let sql = "DELETE FROM  orders WHERE order_id = ?";
  db.query(sql, req.body.p_order_id, (error, result) => {
    if (error) {
      console.log(error);
      res.send({ status: false, message: "Could not cancel order" });
    } else {
      console.log(result);
      let orders = result;
      res.send({
        status: true,
        message: "Order cancelled successfully  ",
        orders,
      });
    }
  });
});

//get news letter data
server.post("/api/shares/getNewsletters", (req, res) => {
  let sql = "CALL get_news_related_to_user(?)";
  db.query(sql, req.body.p_user_id, (error, result) => {
    if (error) {
      console.log(error);
      res.send({
        status: false,
        message: "Could not fetch Data for Most Profitable",
      });
    } else {
      res.send({
        status: true,
        message: "Data retriverd successfully  ",
        result,
      });
    }
  });
});

// get news from api
server.post("/api/getNews", () => {
  let shares_query =
    "SELECT GROUP_CONCAT(DISTINCT share_symbol) as res FROM shares_data;";
  let shares = "AAPL";
  db.query(shares_query, (error, result) => {
    if (error) {
      console.log(error);
      console.log("Could not fetch_shares");
    } else {
      console.log(result);
      shares = result.res;
      console.log("shares_fetched_successfully  ");
    }
  });
  console.log("shares", shares);

  const apiURL =
    "https://api.marketaux.com/v1/news/all?symbols=" +
    shares +
    "&filter_entities=true&language=en&api_token=PS03cbwOep4rlvXwcVWygXZ8LjE9NABa4RQULG5H";

  // Fetch data from the API
  fetch(apiURL)
    .then((response) => response.json())
    .then((data) => {
      // Handle the JSON data here
      //console.log(data);
      let news = data;
      console.log("DATA", news.data);
      //console.log("DATA 1",news.data[1].entities[1].symbol);
      const sql =
        "INSERT INTO news_data (uuid, title, news_description, news_url, image_url, share_symbol) VALUES ?";
      const values = news.data.map((item) => [
        item.uuid,
        item.title,
        item.description,
        item.url,
        item.image_url,
        item.entities[0].symbol, // Assuming the share symbol is in the first entity
      ]);
      db.query(sql, [values], (error, result) => {
        if (error) {
          console.log(error);
          console.log("Could not add news");
        } else {
          console.log(result);
          console.log("News added successfully");
        }
      });
    })
    .catch((error) => {
      // Handle errors during the fetch
      console.error("Error fetching data:", error);
    });
});

// get user balance 
server.post("/api/user/getBalance", (req, res) => {
let sql = "SELECT account_balance FROM accounts where user_id=?";
db.query(sql, req.body.p_user_id, (error, result) => {
  if (error) {
    console.log(error);
    res.send({
      status: false,
      message: error.message,
    });
  } else {
    console.log(result);
    let balance = result;
    res.send({
      status: true,
      message: "Data retriverd successfully",
      balance,
    });
  }
});
});
// get share value at every 2 minutes

server.get("/api/shares/updateShareValue", (req, res) => {
  console.log("hit");
    let sql = "CALL update_share_rates_proc()";
    db.query(sql, (error, result) => {
      if (error) {
        console.log(error);
        res.send({
          status: false,
          message: error.message,
        });
      } else {
        console.log(result);
        let shareValue = result;
        res.send({
          status: true,
          message: "Data retriverd successfully  ",
          shareValue,
        });
      }
    });
  });
  
//get Share Data for graph

server.post("/api/shares/getShareChartData", (req, res) => {
  let details = {
    share_symbol: req.body.data,
  };
 console.log(req,"hittttt");
  console.log(details); 
  let sql = "CALL get_share_rate_history_proc(?)";
  let values = [details.share_symbol];
  db.query(sql, values, (error, result) => {
    if (error) {
      console.log(error);
      res.send({
        status: false,
        message: error.message,
      });
    } else {
      console.log(result);
      let shareChart = result;
      res.send({
        status: true,
        message: "Data retriverd successfully  ",
        shareChart,
      });
    }
  });

});
