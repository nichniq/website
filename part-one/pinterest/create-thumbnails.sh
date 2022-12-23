IFS=$'\n'

for img in `find . -type f -name *.jpg`
do
  thumb=$(echo "$img" | sed 's/\.\//\.\/thumbnails\//')
  mkdir -p $(dirname $thumb)
  cp $img $thumb
  sips -Z 150 $thumb
done

