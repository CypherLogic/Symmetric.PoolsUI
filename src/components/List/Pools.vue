<template>
  <div>
    <div class="text-right ">
      {{ $t('rewardMessage') }} |
      <span class="hide-sm hide-md text-white"
        >Switch View:
        <toggle-button
          @change="switchView"
          :value="showCard"
          :width="70"
          :color="{ checked: '#FB6706', unchecked: '#FB6706' }"
          :switch-color="{ checked: '#123123', unchecked: '#535b5c5b' }"
          :labels="{ checked: 'Cards', unchecked: 'Table' }"
      /></span>
    </div>
    <Container v-if="title" class="d-flex flex-items-center px-4 px-md-0 mb-3">
      <h3 class="flex-auto" v-text="title" />
    </Container>
    <!-- infinite scroll -->
    <div
      v-infinite-scroll="loadMore"
      class="justified-container"
      infinite-scroll-distance="10"
      v-if="showCard"
    >
      <div v-if="pools.length > 0">
        <div class="cards">
          <div class="card" v-for="item in pools" :key="item.id">
            <div class="border highlight-card anim-fade-in rounded-1">
              <a :href="'#/pool/' + item.id" class="myForm">
                <div id="contact-details">
                  <span
                    v-text="$t('marketCap')"
                    class="text-right text-white-normal"
                  />:
                  <span v-text="_num(getLiquidity(item), 'usd-long')" />
                  <div class="grouptext margin-top10">
                    <span
                      v-text="$t('swapFee')"
                      class="row text-white-normal"
                    />
                    <span
                      >: <UiNum :value="item.swapFee" format="percent"
                    /></span>
                  </div>
                  <div class="grouptext margin-top10">
                    <span v-text="$t('apy')" class="text-white-normal" />:
                    <UiNum :value="item.apy" format="percent" class="column" />
                  </div>
                  <div class="grouptext margin-top10">
                    <span v-text="$t('rewardApy')" class="text-white-normal" />:
                    <UiNum :value="item.rewardApy" format="percent" /> SYMM
                    <span v-if="item.rewardApyCelo"> / 
                      <UiNum :value="item.rewardApyCelo" format="percent" /> CELO
                    </span>
                    <span v-if="item.rewardApyKnx"> / 
                      <UiNum :value="item.rewardApyKnx" format="percent" /> KNX
                    </span>
                    <span v-if="item.rewardApyStake"> / 
                      <UiNum :value="item.rewardApyStake" format="percent" /> STAKE
                    </span>
                  </div>
                <div class="grouptext margin-top10">
                    <span v-text="$t('symmReward')" class="text-white-normal" />:
                    <span
                      v-text="_num(item.tokenReward, 'long')"
                      format="long"
                      class=""
                    /> SYMM 
                    <span v-if="item.tokenRewardCelo"> / 
                      <span
                        v-text="_num(item.tokenRewardCelo, 'long')"
                        format="long"
                        class=""
                      /> CELO
                    </span>
                    <span v-if="item.tokenRewardKnx"> / 
                      <span
                        v-text="_num(item.tokenRewardKnx, 'long')"
                        format="long"
                        class=""
                      /> KNX
                    </span>
                    <span v-if="item.tokenRewardStake"> / 
                      <span
                        v-text="_num(item.tokenRewardStake, 'long')"
                        format="long"
                        class=""
                      /> STAKE
                    </span>
                  </div>
                  
                  <div class="grouptext margin-top10">
                    <span v-text="$t('volume24')" class="text-white-normal" />:
                    <span
                      v-text="_num(item.lastSwapVolume, 'usd-long')"
                      format="currency"
                      class=""
                    />
                  </div>

                  <!-- <div style="margin-top: 10px;" class="grouptext">
                    {{ _shortenAddress(item.id) }}
                  </div> -->
                </div>
                <div id="comment-box">
                  <ul :key="token.address" v-for="token in item.tokens">
                    <li style="font-size:9px; color:white">
                      <Icon
                        name="bullet"
                        size="12"
                        :style="`color: ${token.color}`"
                      />
                      {{ _num(token.weightPercent / 100, 'percent-short') }}
                      {{ _shorten(token.symbol, 4) }}
                    </li>
                  </ul>
                  <hr style="width:100%;  opacity: 0" />
                  <Pie
                    :tokens="item.tokens"
                    style="left:30%; position:relative; float:left"
                    size="55"
                  />
                  <!-- <div class="container"> -->
                  <!-- </div> -->
                </div>
                <UiButton class="button-primary">
                  Add Liquidity
                </UiButton>
                <!-- MIVA:SYMM Pool with Farm -->
                <a
                    v-if="item.id === '0x79670b0cb738a0bd826bc7709bc363c6b554690b' || item.id === '0x93b599b54af63518d1dca6a116f323f33888453c'"
                    class="mivafarm"
                    href="https://farm.minerva.digital/"
                    target="_blank"
                >
                  <UiButton
                      class="button-primary"
                  >
                    Streaming Farm
                  </UiButton>
                </a>
                <div class="grouptext">
                  <span
                    v-text="$t('myLiquidity')"
                    class="text-white-normal text-left"
                  />:
                  <span
                    style="color: #FB6706"
                    v-text="_num(myLiquidity(item), 'usd-long')"
                    format="currency"
                  />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <ListLoading
        v-if="loading"
        :classes="[
          'column-sm text-left hide-sm hide-md hide-lg',
          'flex-auto text-left',
          'column hide-sm hide-md',
          'column',
          'column hide-sm hide-md hide-lg',
          'column hide-sm hide-md hide-lg'
        ]"
        :height="29"
      />
    </div>
    <!-- infinite scroll ends -->
    <UiTable class="anim-fade-in" v-if="!showCard">
      <UiTableTh>
        <div class="text-white hide-sm hide-md hide-lg " v-text="$t('poolAddress')" />
        <div style="padding-left:80px;"></div>
        <div v-text="$t('assets')" class="text-white column flex-auto text-left" />
        <div v-text="$t('marketCap')" class="text-white column" />
        <div v-text="$t('swapFee')" class="text-white column hide-sm hide-md" />
        <div v-text="$t('apy')" class="text-white column hide-sm hide-md" />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <div
          v-text="$t('rewardApy')"
          class="text-white column-sm hide-sm hide-md"
        />
        <div
          v-text="$t('symmReward')"
          class="text-white column-lg hide-sm hide-md"
        />
        &nbsp;
        <div
          v-text="$t('myLiquidity')"
          class="text-white column hide-sm hide-md hide-lg"
        />
        <div
          v-text="$t('volume24')"
          class="text-white column-medium2 hide-sm hide-md hide-lg"
        />
      </UiTableTh>
      <div v-infinite-scroll="loadMore" infinite-scroll-distance="10">
        <div v-if="pools.length > 0">
          <ListPool v-for="(pool, i) in pools" :key="i" :pool="pool" />
        </div>
        <UiTableTr v-else-if="!loading">
          <div v-text="$t('emptyState')" />
        </UiTableTr>
        <ListLoading
          v-if="loading"
          :classes="[
            'column-sm text-left hide-sm hide-md hide-lg',
            'flex-auto text-left',
            'column hide-sm hide-md',
            'column',
            'column hide-sm hide-md hide-lg',
            'column hide-sm hide-md hide-lg'
          ]"
          :height="29"
        />
      </div>
    </UiTable>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { formatFilters, ITEMS_PER_PAGE } from '@/helpers/utils';
import { getPoolLiquidity } from '@/helpers/price';

export default {
  props: ['query', 'title'],
  computed: {},
  data() {
    return {
      loading: false,
      cols: 2,
      showCard: this.$cookie.get('cardView') === 'true' ? true : false,
      page: 0,
      pools: [],
      filters: formatFilters(this.$route.query)
    };
  },
  mounted() {
    console.log(`showCard: ${this.showCard} - ${this.$cookie.get('cardView')}`);
    this.showCard = this.$cookie.get('cardView') === 'true' ? true : false;
    console.log(`showCard: ${this.showCard} - ${this.$cookie.get('cardView')}`);
  },
  watch: {
    query() {
      this.page = 0;
      this.loading = true;
      this.loadMore();
    },
    filters() {
      if (!this.withFilters) return;
      this.page = 0;
      this.loading = true;
      this.pools = [];
      let query = formatFilters(this.filters);
      if (query.token && query.token.length === 0) query = {};
      query.filter = 1;
      this.$router.push({ query });
      this.loadMore();
    }
  },
  methods: {
    switchView(val) {
      this.$cookie.delete('cardView');
      this.$cookie.set('cardView', val.value, 5);
      this.showCard = val.value;
      console.log(val.value);
    },
    getLiquidity(pool) {
      return getPoolLiquidity(pool, this.price.values);
    },
    myLiquidity(pool) {
      const poolShares = this.subgraph.poolShares[pool.id];
      if (!pool.finalized || !poolShares) return 0;
      return (this.getLiquidity(pool) / pool.totalShares) * poolShares;
    },
    ...mapActions(['getPools']),
    async loadMore() {
      console.log(
        `loadMore: ${this.pools.length} - ${this.page} - ${ITEMS_PER_PAGE} `
      );
      if (this.pools.length < this.page * ITEMS_PER_PAGE) return;
      this.loading = true;
      this.page++;
      const page = this.page;
      let query = this.query || {};
      query = { ...query, page };
      const pools = await this.getPools(query);
      this.pools = this.pools.concat(pools);
      this.loading = false;
      if (this.$cookie.get('cardView') === null) {
        this.switchView({ value: true });
        this.showCard = true;
      }
    }
  }
};
</script>
<style scoped>
.card {
  background-color: #272727;
  /* color: blue; */
  padding: 0px;
  /* height: 13rem; */
  margin: 5px;
}
.highlight-card {
  height: 100%;
}
.cards {
  /* background-color: #0A1E2A; */
  background: linear-gradient(
    178deg,
    rgb(10 30 42 / 4%) 23.98%,
    #0a1e2a83 100%
  );
  margin: 0 auto;
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(370px, 1fr));
}
.margin-top10 {
  margin-top: 2px;
}
.myForm {
  display: grid;
  grid-template-areas:
    'comments contact'
    '... button';
  grid-template-rows: 12.5em 3em;
  grid-template-columns: 10.5em 1fr;
  grid-gap: 0.2em;
  background: linear-gradient(
    178deg,
    rgb(56 74 255 / 4%) 23.98%,
    #253743a1 100%
  );
  padding: 1em;
  height: 100%;
}
.myForm label {
  grid-area: labels;
}
.myForm input {
  grid-area: contact;
  width: 100%;
  padding: 1.1em;
  border: none;
  margin-bottom: 1em;
}
.myForm textarea {
  min-height: calc(100% - 2em);
  width: 100%;
  border: none;
}
#contact-details {
  grid-area: contact;
}
.border {
  border: 1px solid #566b79 !important;
}
#comment-box {
  grid-area: comments;
  width: 100%;
}
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  float: left;
}
li {
  float: left;
  word-spacing: 2px;
}
.myForm button {
  grid-area: button;
  border: 0;
  background: #5b8470;
  color: white;
}
.text-white-normal {
  color: white;
  font-weight: 480;
  font-size: 12px;
}
.highlight-card:hover {
  background-color: #0a1e2a;
}
.container {
  display: flex;
  border: 0px solid;
}
.col {
  margin: 0px;
  border: 0px solid;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.item-container {
  border: 1px solid;
}
</style>
