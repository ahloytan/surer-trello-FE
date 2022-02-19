export function eleVal(ele){
	ele = ele.toLowerCase();
	ele = ele.charAt(0).toUpperCase() + ele.slice(1);
	return ele;
}

export function tog(condition){
  if (condition){
    return true;
  } else{
    return false;
  }
}
