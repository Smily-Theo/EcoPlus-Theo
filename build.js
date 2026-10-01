const fs=require("fs"), path=require("path");
const src=path.join(__dirname,"public"), out=path.join(__dirname,"dist");
fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(out,{recursive:true});
for(const file of fs.readdirSync(src)){
  fs.copyFileSync(path.join(src,file),path.join(out,file));
}
console.log("EcoPlus build complete.");
