var dashboardUrl = process.env.CORS_DOMAIN_URL + "api/dashboard";
var userDetailsUrl = process.env.CORS_DOMAIN_URL + "api/userdetails";
var logOutUrl = process.env.CORS_DOMAIN_URL + "api/logout";
var addTodoUrl = process.env.CORS_DOMAIN_URL + "api/addTodo";
var deleteTodoUrl = process.env.CORS_DOMAIN_URL + "api/deleteTodo";
var completeTodoUrl = process.env.CORS_DOMAIN_URL + "api/completeTodo";
var updateTodoUrl = process.env.CORS_DOMAIN_URL + "api/updateTodo";

$(document).ready(() => {
  $(".editTodoDiv").hide();
  checkSession();

  $("#logOutBtn").click(() => {
    fetch(logOutUrl, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (response.status != 200) {
          alert("logout failed");
          throw new error("logout failed");
        } else {
          alert("Logout Successfull");
          window.location.href = "/pages/login.html";
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });

  $("#addTodoBtn").click(() => {
    var newTodo = $("#addNewTodo").val();
    if (newTodo.trim() == "") {
      alert("Todo should not be empty");
      return;
    }
    const data = { todo: newTodo };
    fetch(addTodoUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    })
      .then((response) => {
        if (response.status != 200) {
          alert("Error");
          return;
        }
        return response.json();
      })
      .then((data) => {
        alert("Added todo successfully");
        window.location.href = "/api/dashboard";
        return false;
      })
      .catch((error) => {
        console.error(error);
      });
  });
});

const getUserDetails = () => {
  fetch(userDetailsUrl, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (response.status == 401) {
        alert("Unauthorized User");
        window.location.href = "/pages/login.html";
      } else if (response.status != 200) {
        alert("Error");
        $("#userName").text("Error Occured!!");
      }
      return response.json();
    })
    .then((data) => {
      $("#userName").text(data.firstName + " " + data.lastName);
    })
    .catch((error) => {
      console.error(error);
    });
};

const checkSession = () => {
  fetch(dashboardUrl, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (response.status != 200) {
        alert("Unauthorized. Redirecting to login page.");
        window.location.href = "/pages/login.html";
      } else {
        getUserDetails();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error checking session");
      window.location.href = "/pages/login.html";
    });
};

const todoDelete = (el) => {
  const todoid = $(el).parent().parent().data().id;
  fetch(deleteTodoUrl + "/" + todoid, {
    method: "DELETE",
    credentials: "include",
  })
    .then((response) => {
      if (response.status != 200) {
        alert("Error");
        return;
      }
      return response.json();
    })
    .then((data) => {
      alert("Deleted todo successfully");
      window.location.href = "/api/dashboard";
      return false;
    })
    .catch((error) => {
      console.error(error);
    });
};

const todoCheck = (el) => {
  if (el.checked == true) {
    const todoid = $(el).closest("tr").data().id;
    fetch(completeTodoUrl + "/" + todoid, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (response.status != 200) {
          alert("Error");
          return;
        }
        return response.json();
      })
      .then((data) => {
        alert("Completed todo successfully");
        window.location.href = "/api/dashboard";
        return false;
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    console.log("Checkbox error");
  }
};

const todoEdit = (el) => {
  let todoText = $(el).parent().siblings("th").children("p").text();
  $(el).parent().siblings("th").children("div").children("input").val(todoText);
  $(el).parent().siblings("th").children("p").hide();
  $(el).parent().siblings("th").children("div").show();
  $(el).parent().siblings("td").children().hide();
  $(el).parent().children().hide();
};

const todoUpdateCancel = (el) => {
  $(el).parent().siblings("p").show();
  $(el).parent().parent().siblings("td").children().show();
  $(el).parent().hide();
};

const todoUpdate = (el) => {
  const newTodo = $(el).siblings("input").val();
  const todoid = $(el).closest("tr").data().id;
  if (newTodo.trim() == "") {
    alert("Todo should not be empty");
    return;
  }
  const data = { todo: newTodo };
  fetch(updateTodoUrl + "/" + todoid, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  })
    .then((response) => {
      if (response.status != 200) {
        alert("Error");
        return;
      }
      return response.json();
    })
    .then((data) => {
      alert("Updated todo successfully");
      window.location.href = "/api/dashboard";
      return false;
    })
    .catch((error) => {
      console.error(error);
    });
};
