import React, { useState } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core";

import {
  Typography,
  List,
  ListItem,
  Divider,
  Box,
  IconButton,
  Collapse,
  Badge,
  Select,
  MenuItem,
  ListItemText,
  Checkbox,
} from "@material-ui/core";

import TodoItem from "./TodoItem.js";

import AddIcon from "@material-ui/icons/Add";
import SortByAlphaIcon from "@material-ui/icons/SortByAlpha";
import FilterListIcon from "@material-ui/icons/FilterList";

const useStyles = makeStyles((theme) => ({
  sortRoot: {
    height: 20,
    width: 70,
    padding: theme.spacing(1),
    textAlign: "right",
  },
  filterRoot: {
    height: 20,
    padding: theme.spacing(1),
    textAlign: "right",
  },
  select: {
    borderRadius: 20,
    "&:focus": {
      borderRadius: 20,
    },
    paddingLeft: 40,
  },
  icon: {
    left: 15,
  },
  iconOpen: {
    transform: "none",
  },
  outlined: {
    "&:select": {
      paddingRight: 0,
    },
  },
  sortEl: {
    borderRadius: 20,
    marginRight: theme.spacing(1),
  },
}));

const Todo = () => {
  const classes = useStyles();

  //If a new to-do item is being created
  const [creatingTodo, setCreatingTodo] = useState(false);

  //If a new to-do item has just been created
  const [createdTodo, setCreatedTodo] = useState(false);

  //Property to sort to-do items by
  const [sortVar, setSortVar] = useState("priority");

  //Property to sort to-do items by
  const [sortTags, setSortTags] = useState([]);

  //Default to-do item properties
  const [defaultTodo, setDefaultTodo] = useState({
    title: "Task",
    dateDue: new Date().setSeconds(0, 0),
    repeatOption: "None",
    dateCreated: new Date().setSeconds(0, 0),
    priority: 3,
    checked: false,
    repeatWeekly: 0,
    repeatMonthly: 1,
    tags: [],
  });

  //Gets all to-do items
  const todos = useSelector((state) => state.todos);

  const createNewTodo = () => {
    if (!creatingTodo) {
      //Updates default date/time to current date/time every time add task is pressed
      setDefaultTodo({
        ...defaultTodo,
        dateDue: new Date().setSeconds(0, 0),
        dateCreated: new Date().setSeconds(0, 0),
      });
      setCreatingTodo(true);
    }
  };

  function quickSort(arr, leftPos, rightPos, arrLength, sortBy) {
    let initialLeftPos = leftPos;
    let initialRightPos = rightPos;
    let direction = true;
    let pivot = rightPos;
    let arrPivot, arrLeft, arrRight;
    let secPivot, secLeft, secRight;

    while (leftPos - rightPos < 0) {
      switch (sortBy) {
        case "priority":
          arrPivot = arr[pivot].priority;
          arrLeft = arr[leftPos].priority;
          arrRight = arr[rightPos].priority;
          secPivot = arr[pivot].dateDue;
          secLeft = arr[leftPos].dateDue;
          secRight = arr[rightPos].dateDue;
          break;
        case "dateDue":
          arrPivot = arr[pivot].dateDue;
          arrLeft = arr[leftPos].dateDue;
          arrRight = arr[rightPos].dateDue;
          secPivot = arr[pivot].priority;
          secLeft = arr[leftPos].priority;
          secRight = arr[rightPos].priority;
          break;
        case "name":
          arrPivot = arr[pivot].title;
          arrLeft = arr[leftPos].title;
          arrRight = arr[rightPos].title;
          secPivot = arr[pivot].dateDue;
          secLeft = arr[leftPos].dateDue;
          secRight = arr[rightPos].dateDue;
          break;
        default:
          break;
      }

      if (direction) {
        if (arrPivot < arrLeft) {
          quickSort.swap(arr, pivot, leftPos);
          pivot = leftPos;
          rightPos--;
          direction = !direction;
        } else {
          if (arrPivot === arrLeft && secPivot < secLeft)
            quickSort.swap(arr, pivot, leftPos);
          else leftPos++;
        }
      } else {
        if (arrPivot <= arrRight) {
          if (arrPivot === arrRight && secPivot > secRight)
            quickSort.swap(arr, pivot, rightPos);
          else rightPos--;
        } else {
          quickSort.swap(arr, pivot, rightPos);
          leftPos++;
          pivot = rightPos;
          direction = !direction;
        }
      }
    }
    if (pivot - 1 > initialLeftPos) {
      quickSort(arr, initialLeftPos, pivot - 1, arrLength, sortBy);
    }
    if (pivot + 1 < initialRightPos) {
      quickSort(arr, pivot + 1, initialRightPos, arrLength, sortBy);
    }
  }

  quickSort.swap = (arr, el1, el2) => {
    let swapedElem = arr[el1];
    arr[el1] = arr[el2];
    arr[el2] = swapedElem;
  };

  if (todos.length > 0) {
    var sortedArray = createdTodo
      ? todos.slice(0, todos.length - 1)
      : todos.slice(0);

    quickSort(
      sortedArray,
      0,
      sortedArray.length - 1,
      sortedArray.length,
      sortVar
    );
  }

  const displayItems = () => {
    if (todos.length > 0)
      return (
        <>
          {createdTodo ? (
            <>
              <ListItem key={todos[todos.length - 1]._id}>
                <Badge
                  color="secondary"
                  badgeContent="New!"
                  anchorOrigin={{ vertical: "top", horizontal: "left" }}
                  style={{ width: "inherit" }}
                >
                  <TodoItem
                    todoData={todos[todos.length - 1]}
                    isNew={false}
                    setNew={setCreatingTodo}
                    style={{ border: "3px solid red" }}
                    setCreatedTodo={setCreatedTodo}
                  />
                </Badge>
              </ListItem>
              <Divider />
            </>
          ) : null}

          {sortedArray.map((todo) => (
            <ListItem key={todo._id}>
              <TodoItem
                todoData={todo}
                isNew={false}
                setNew={setCreatingTodo}
                setCreatedTodo={setCreatedTodo}
              />
            </ListItem>
          ))}
        </>
      );
  };

  return (
    <>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Typography variant="h4">To-do List</Typography>

        <div style={{ flexGrow: 1 }}></div>

        <Select
          variant="outlined"
          value={sortVar}
          onChange={(e) => setSortVar(e.target.value)}
          className={classes.sortEl}
          classes={{
            root: classes.sortRoot,
            select: classes.select,
            icon: classes.icon,
            iconOpen: classes.iconOpen,
            outlined: classes.outlined,
          }}
          IconComponent={SortByAlphaIcon}
        >
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="priority">Priority</MenuItem>
          <MenuItem value="dateDue">Date Due</MenuItem>
        </Select>

        <Select
          multiple
          variant="outlined"
          value={sortTags}
          onChange={(e) => setSortTags(e.target.value)}
          className={classes.sortEl}
          classes={{
            root: classes.filterRoot,
            select: classes.select,
            icon: classes.icon,
            iconOpen: classes.iconOpen,
            outlined: classes.outlined,
          }}
          IconComponent={FilterListIcon}
          renderValue={(selected) => {
            console.log(selected);
            selected.join(", ");
          }}
        >
          <MenuItem key="Option 1" value="Option 1">
            <Checkbox checked={sortTags.indexOf("Option 1") > -1} />
            <ListItemText primary="Option 1" />
          </MenuItem>
          <MenuItem key="Option 2" value="Option 2">
            <Checkbox checked={sortTags.indexOf("Option 2") > -1} />
            <ListItemText primary="Option 2" />
          </MenuItem>
          <MenuItem key="Option 3" value="Option 3">
            <Checkbox checked={sortTags.indexOf("Option 3") > -1} />
            <ListItemText primary="Option 3" />
          </MenuItem>
        </Select>

        <IconButton color="primary" onClick={createNewTodo}>
          <AddIcon fontSize="large" />
        </IconButton>
      </Box>

      <Divider />

      <List>
        <Collapse in={creatingTodo}>
          <ListItem key="new">
            <TodoItem
              todoData={defaultTodo}
              isNew={true}
              setNew={setCreatingTodo}
              setCreatedTodo={setCreatedTodo}
            />
          </ListItem>
        </Collapse>

        {displayItems()}
      </List>
    </>
  );
};

export default Todo;
