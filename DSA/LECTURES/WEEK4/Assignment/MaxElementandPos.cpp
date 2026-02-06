#include<bits/stdc++.h>
using namespace std;
void func(vector<long long>&v)
{
    long long max = INT_MIN; 
    int pos = 0;
    int i =0;
    for(i; i<v.size() ; i++)
    {
        if(v[i] > max)
        {
            max = v[i];
            pos=i;
        }
    }
   cout<<max<<" "<<pos+1;
} 
int main()
{
    int n ; 
    cin>>n;
    vector<long long>a(n); 
    for(int i =0 ;i<n ; i++)
    {
        cin>>a[i]; 
    }
    func(a);
    
}