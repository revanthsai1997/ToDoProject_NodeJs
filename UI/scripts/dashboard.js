var dashboardUrl = domainURL + "api/dashboard";
var userDetailsUrl = domainURL + "api/userdetails";
var logOutUrl = domainURL + "api/logout";
var addTodoUrl = domainURL + "api/addTodo";
var deleteTodoUrl = domainURL + "api/deleteTodo";
var completeTodoUrl = domainURL + "api/completeTodo";
var updateTodoUrl = domainURL + "api/updateTodo";

$(document).ready(() => {
  $(".editTodoDiv").hide();
  checkSession();

  $("#logOutBtn").click(() => {
    const token = getToken();

    fetch(logOutUrl, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: token,
      },
    })
      .then((response) => {
        if (response.status != 200) {
          alert("logout failed");
          throw new error("logout failed");
        } else {
          alert("Logout Successfull");
          localStorage.clear();
          window.location.href = "/pages/login.html";
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });

  $("#addTodoBtn").click(() => {
    const token = getToken();

    var newTodo = $("#addNewTodo").val();
    if (newTodo.trim() == "") {
      alert("Todo should not be empty");
      return;
    }
    const data = { todo: newTodo };
    fetch(addTodoUrl, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    })
      .then((response) => {
        if (response.status == 401) {
          alert("Unauthorized User");
          window.location.href = "/pages/login.html";
          return;
        } else if (response.status != 200) {
          alert("Error");
          return;
        }
        return response.json();
      })
      .then((data) => {
        alert("Added todo successfully");
        window.location.href = "/api/dashboard/"+token;
        return false;
      })
      .catch((error) => {
        console.error(error);
      });
  });
});

const getUserDetails = () => {
  const token = getToken();

  fetch(userDetailsUrl, {
    method: "GET",
    credentials: "include",
    headers:{
      'Authorization':token
    }
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
  const token = getToken();
  fetch(dashboardUrl, {
    method: "GET",
    credentials: "include",
    headers:{
      'Authorization':token
    }
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

const getToken = () => {
  const token = localStorage.getItem("AuthorizationToken");
  if (token == null) {
    alert("Unauthorized. Redirecting to login page.");
    window.location.href = "/pages/login.html";
    return;
  }
  return token;
};

const todoDelete = (el) => {
  const token = getToken();

  const todoid = $(el).parent().parent().data().id;
  fetch(deleteTodoUrl + "/" + todoid, {
    method: "DELETE",
    credentials: "include",
    headers:{
      'Authorization':token
    }
  })
    .then((response) => {
      if(response.status == 401){
        alert("Unauthorized User");
        window.location.href = '/pages/login.html';
        return;
      }
      else if (response.status != 200) {
        alert("Error");
        return;
      }
      return response.json();
    })
    .then((data) => {
      alert("Deleted todo successfully");
      window.location.href = "/api/dashboard/"+token;
      return false;
    })
    .catch((error) => {
      console.error(error);
    });
};

const todoCheck = (el) => {
  const token = getToken();

  if (el.checked == true) {
    const todoid = $(el).closest("tr").data().id;
    fetch(completeTodoUrl + "/" + todoid, {
      method: "GET",
      credentials: "include",
      headers:{
        'Authorization':token
      }
    })
      .then((response) => {
        if(response.status == 401){
          alert("Unauthorized User");
          window.location.href = '/pages/login.html';
          return;
        }
        else if (response.status != 200) {
          alert("Error");
          return;
        }
        return response.json();
      })
      .then((data) => {
        alert("Completed todo successfully");
        window.location.href = "/api/dashboard/"+token;
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
  const token = getToken();

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
      'Authorization':token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include"
  })
    .then((response) => {
      if(response.status == 401){
        alert("Unauthorized User");
        window.location.href = '/pages/login.html';
        return;
      }
      else if (response.status != 200) {
        alert("Error");
        return;
      }
      return response.json();
    })
    .then((data) => {
      alert("Updated todo successfully");
      window.location.href = "/api/dashboard/"+token;
      return false;
    })
    .catch((error) => {
      console.error(error);
    });
};
