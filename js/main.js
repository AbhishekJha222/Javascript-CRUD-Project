import productdb, { bulkcreate, getData, createEle } from "./module.js";

let db = productdb("Productdb", {
  products: `++id, name, seller, price`,
});

//Input tags

const userid = document.getElementById("userid");
const proname = document.getElementById("proname");
const seller = document.getElementById("seller");
const price = document.getElementById("price");

//Buttons
const btncreate = document.getElementById("btn-create");
const btnread = document.getElementById("btn-read");
const btnupdate = document.getElementById("btn-update");
const btndelete = document.getElementById("btn-delete");

//Notfound

const notfound = document.getElementById("notfound");

//Insert value using create button
btncreate.onclick = (event) => {
  let flag = bulkcreate(db.products, {
    name: proname.value,
    seller: seller.value,
    price: price.value,
  });
  // console.log(flag);

  proname.value = "";
  seller.value = "";
  price.value = "";

  getData(db.products, (data) => {
    userid.value = data.id + 1 || 1;
  });

  table();

  let insertmsg = document.querySelector(".insertmsg");

  getMsg(flag, insertmsg);
};

//Create event on btn read button
btnread.onclick = table;

//Update Event
btnupdate.onclick = () => {
  const id = parseInt(userid.value || 0);
  if (id) {
    db.products
      .update(id, {
        name: proname.value,
        seller: seller.value,
        price: price.value,
      })
      .then((updated) => {
        // let get = updated ? `data updated` : 'Data not updated';
        let get = updated ? true : false;

        let updatemsg = document.querySelector(".updatemsg");
        getMsg(get, updatemsg);

        proname.value = "";
        seller.value = "";
        price.value = "";
      });
  }
};

//Delete Records

btndelete.onclick = () => {
  db.delete();

  //After deleting records create the database again.
  db = productdb("Productdb", {
    products: `++id, name, seller, price`,
  });
  db.open();
  table();
  textID(userid);

  let deletemsg = document.querySelector(".deletemsg");
  getMsg(true, deletemsg);
};

//window onload event

window.onload = () => {
  textID(userid);
};

function textID(textboxid) {
  getData(db.products, (data) => {
    textboxid.value = data.id + 1 || 1;
  });
}

function table() {
  const tbody = document.getElementById("tbody");

  while (tbody.hasChildNodes()) {
    tbody.removeChild(tbody.firstChild);
  }

  getData(db.products, (data) => {
    if (data) {
      createEle("tr", tbody, (tr) => {
        for (const value in data) {
          createEle("td", tr, (td) => {
            td.textContent =
              data.price === data[value] ? `$ ${data[value]}` : data[value];
          });
        }
        createEle("td", tr, (td) => {
          createEle("i", td, (i) => {
            i.className += "fas fa-edit btnedit";
            i.setAttribute(`data-id`, data.id);
            i.onclick = editbtn;
          });
        });

        createEle("td", tr, (td) => {
          createEle("i", td, (i) => {
            i.className += "fas fa-trash-alt btndelete";
            i.setAttribute(`data-id`, data.id);
            i.onclick = deletebtn;
          });
        });
      });
    } else {
      notfound.textContent = "No record found in the database!";
    }
  });

  // createEle("td", tbody, (td)=>{
  //     console.log(td);
  // })
  // let td = document.createElement("td");
  // console.log(tbody);
  // tbody.appendChild(td);
  // console.log(td);
}

function editbtn(event) {
  console.log(event.target.dataset.id);
  let id = parseInt(event.target.dataset.id);
  // console.log(typeof id);
  db.products.get(id, (data) => {
    userid.value = data.id || 0;
    proname.value = data.name || "";
    seller.value = data.seller || "";
    price.value = data.price || "";
  });
}

//Delete individual row from the database - table
function deletebtn(event) {
  let id = parseInt(event.target.dataset.id);
  db.products.delete(id);
  table();
}

function getMsg(flag, element) {
  if (flag) {
    element.className += "movedown";

    setTimeout(() => {
      element.classList.forEach(classname => {
        classname == "movedown"
          ? undefined
          : element.classList.remove("movedown");
      });
    }, 4000);
  }
}
