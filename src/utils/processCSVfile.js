const processCsvFile = function (file) {
  const arrayOrRows = splitCsvFileByLines(file);
  return arrayOrRows
};

function splitCsvFileByLines(target) {
  const fastaArray = target.split(">");
  const reads = []
  const ref = []
  const regex = /^-*/g
  const dnaSeq = /[ATCG]{18,32}/g
  fastaArray.forEach((fasta, i) => {
    if (!fasta) return
    const tmpSplit = fasta.split('\n')


    const unit = {
      seqName: tmpSplit[0],
      seq: tmpSplit[1].match(dnaSeq)[0],
      start: tmpSplit[1].match(regex)[0]?.length || 0,
      end: tmpSplit[1].match(regex)[0]?.length || 0 ? tmpSplit[1].match(dnaSeq)[0].length : tmpSplit[1].match(dnaSeq)[0].length + tmpSplit[1].match(regex)[0]?.length,
      orientation: tmpSplit[0].endsWith('reversed') ? 'reverse' : 'forward',
    }
    if(i === 1) {
      ref.push(unit)
    } else { reads.push(unit) }
  }
  )
  return {ref, reads}

}

export default processCsvFile;
