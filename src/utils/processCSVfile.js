const processCsvFile = function (file, name) {
  const arrayOfFastaEntries = splitMultiFasta(file, name);
  return arrayOfFastaEntries
};

function splitMultiFasta(target, name) {
  const fastaArray = target.split(">");
  const reads = []
  let ref = {}
  const regexGaps = /^-*/
  const dnaSeq = /[ATCG]{18,32}/
  const dtsetPattern = /\d[A-Z]_\d/
  const virusPattern = /SMoV|StrV1|SCV/
  const variantPattern = /(RNA\d)?[ABC](?=.fasta)/
  const dataset = name.match(dtsetPattern)[0]
  const virus = name.match(virusPattern)[0]
  const variant = name.match(variantPattern)[0]


  fastaArray.forEach((fasta, i) => {
    if (!fasta) return

    
    const tmpSplit = fasta.split('\n')
    const tmpFirstLine = tmpSplit[0];
    const tmpSecondLine = tmpSplit[1];
    const tmpSeq = i === 1 ? tmpSecondLine : tmpSecondLine.match(dnaSeq)[0];
    const gapsBeforeSeq = tmpSecondLine.match(regexGaps)[0];

    const unit = {
      seqName: tmpFirstLine,
      seq: tmpSeq,
      seqLength: tmpSeq.length,
      start: gapsBeforeSeq?.length || 0,
      end: gapsBeforeSeq?.length || 0 ? tmpSeq.length : tmpSeq.length + gapsBeforeSeq?.length,
      orientation: tmpFirstLine.endsWith('reversed)') ? 'reverse' : 'forward',
    }

    if(i === 1) {
      ref = {
        seqName: unit.seqName,
        seq: unit.seq,
        seqLength: unit.seqLength}

    } else { reads.push(unit) }
  }
  )
  const countReverseReads = reads.filter(read => read.orientation === 'reverse').length
  // const frRvRatio = countReverseReads
  const frRvRatio = ((reads.length - countReverseReads) / countReverseReads).toFixed(1)

  const uniques = new Set(reads.flatMap( ({seq}) => seq))
  const uniqueReads = [...uniques]
  const uniquesCount = uniques.size
  const totalCount = reads.length
  const nonRedundantPerc = (100 * uniquesCount / totalCount).toFixed(1);
// file name is attached to the dataset in IndexView in function 'showFiles'
  return {dataset, virus,variant, ref, reads, uniqueReads, frRvRatio, totalCount, nonRedundantPerc}

}

export default processCsvFile;
